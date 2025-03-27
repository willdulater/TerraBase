// ProfileDataService.js
// A simple service that handles loading and caching profile data

class ProfileDataService {
    constructor() {
      this.applicantData = [];
      this.matches = [];
      this.distances = [];
      this.dataLoaded = false;
      this.loading = false;
      this.socket = null;
      this.subscribers = [];
    }
  
    // Initialize the socket reference
    setSocket(socket) {
      this.socket = socket;
    }
  
    // Subscribe to data changes
    subscribe(callback) {
      this.subscribers.push(callback);
      // Immediately notify with current state
      if (this.dataLoaded) {
        callback({
          applicantData: this.applicantData,
          matches: this.matches,
          distances: this.distances,
          loading: this.loading,
          dataLoaded: this.dataLoaded
        });
      }
      
      // Return unsubscribe function
      return () => {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
      };
    }
  
    // Notify all subscribers of data changes
    notifySubscribers() {
      const data = {
        applicantData: this.applicantData,
        matches: this.matches,
        distances: this.distances,
        loading: this.loading,
        dataLoaded: this.dataLoaded
      };
      
      this.subscribers.forEach(callback => callback(data));
    }
  
    // Calculate similarity from distances
    transformDistances(distancesArray) {
      if (!Array.isArray(distancesArray) || distancesArray.length === 0) {
        console.error("Invalid distances array");
        return [];
      }
  
      const maxDistance = Math.max(...distancesArray);
      if (maxDistance === 0) return distancesArray.map(() => 0);
  
      return distancesArray.map(distance => {
        const similarity = (1 - distance / maxDistance) * 100;
        return similarity.toFixed(2);
      });
    }
  
    // Load all profile data
    loadData(userId) {
      if (!this.socket) {
        console.error("Socket not initialized. Call setSocket first.");
        return;
      }
  
      if (this.loading) {
        console.log("Data already loading, skipping request");
        return;
      }
  
      // If data is already loaded, just notify subscribers
      if (this.dataLoaded) {
        this.notifySubscribers();
        return;
      }
  
      this.loading = true;
      this.notifySubscribers();
  
      // Set up one-time message handler for this load operation
      const messageHandler = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.websocket_type === "getapplicantprofiles") {
          if (data.profiles && Array.isArray(data.profiles)) {
            this.applicantData = data.profiles;
            console.log("Received applicant profiles:", data.profiles.length);
            
            // Check if we've loaded both types of data
            this.checkDataLoaded();
          }
        }
        
        if (data.websocket_type === "profilematcher") {
          // Process match data
          if (data.matches && data.distances) {
            const matchesArray = Object.values(data.matches).flat();
            const distancesArray = this.transformDistances(
              Object.values(data.distances).flat()
            );
            
            this.matches = matchesArray;
            this.distances = distancesArray;
            console.log("Received matches:", matchesArray.length);
            
            // Check if we've loaded both types of data
            this.checkDataLoaded();
          }
        }
      };
  
      // Add temporary listener
      this.socket.addEventListener('message', messageHandler);
  
      // Send requests for both types of data
      this.socket.send(
        JSON.stringify({
          websocket_type: "getapplicantprofiles"
        })
      );
  
      this.socket.send(
        JSON.stringify({
          websocket_type: "profilematcher",
          id: userId
        })
      );
  
      // Return a promise that resolves when data is loaded
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.dataLoaded) {
            clearInterval(checkInterval);
            this.socket.removeEventListener('message', messageHandler);
            resolve({
              applicantData: this.applicantData,
              matches: this.matches,
              distances: this.distances
            });
          }
        }, 500);
      });
    }
  
    // Check if both types of data are loaded
    checkDataLoaded() {
      if (this.applicantData.length > 0 && this.matches.length > 0) {
        this.dataLoaded = true;
        this.loading = false;
        this.notifySubscribers();
      }
    }
  
    // Clear all data (useful for testing or reset)
    clearData() {
      this.applicantData = [];
      this.matches = [];
      this.distances = [];
      this.dataLoaded = false;
      this.loading = false;
      this.notifySubscribers();
    }
  }
  
  // Create and export a singleton instance
  const profileDataService = new ProfileDataService();
  export default profileDataService;