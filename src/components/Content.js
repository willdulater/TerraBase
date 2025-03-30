import React, { useEffect, useState } from "react";
import Left from "./Left";
import Spinner from "./Spinner";
import Request from "./Request";
import Cookies from "universal-cookie";

import ChatModal from "./Center/ChatModal";
import { useAuth0 } from "@auth0/auth0-react";
import * as Sentry from "@sentry/react";
import studentData from "./studentData.json";
import ImageUploader from "./ImageUploader";
import ImageMatcher from "./ImageMatcher";
import ImageGalleryTest from "./ImageGalleryTest";

const cookies = new Cookies();

const Content = () => {
  // auth0 stuff, get name, email address
  const { user } = useAuth0();

  // which mode a user is in
  const [selectedMode, setSelectedMode] = useState(() => {
    // Retrieve mode from localStorage or default to "profile"
    return localStorage.getItem("selectedMode") || "imagematcher";
  });


  const [interviewThreads, setInterviewThreads] = useState([]);
  const [selectedInterviewThread, setSelectedInterviewThread] = useState("");

  // chat mode
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState("");

  // freewrite mode
  const [freewriteThreads, setFreewriteThreads] = useState([]);
  const [selectedFreewriteThread, setSelectedFreewriteThread] = useState("");

  // user info
  const [userID, setUserID] = useState("");
  const [subscription, setSubscription] = useState({});
  const [userInfo, setUserInfo] = useState({});

  // close navbar
  const [showNav, setShowNav] = useState(true);

  // websocket connection
  const [socket, setSocket] = useState(null);
  const [reconnectSocket, setReconnectSocket] = useState(false);

  // show CTA subscribed modal
  const [showCTASubscribed, setShowCTASubscribed] = useState(false);


  //show interview input modal
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // show new chat moadl
  const [showChatModal, setShowChatModal] = useState(false);


  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState(studentData[0].id);

  const student = studentData[0];

  //defines the user profile

  const [gender, setGender]= useState("");
  const [race, setRace]= useState("");
  const [intendedMajor, setIntendedMajor]= useState("");

  const [satScore, setSatScore] = useState("");
  const [actScore, setActScore] = useState("");
  const [unweightedGpa, setUnweightedGpa] = useState("N/A");

  const [extracurriculars, setExtracurriculars] = useState([]);

  const [awards, setAwards] = useState([]);
  
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [change, setChange] = useState(false);


//saved the page the user is on when reloading
  useEffect(() => {
    localStorage.setItem("selectedMode", selectedMode);
  }, [selectedMode]);


  useEffect(() => {
    if (cookies.get("token") === undefined) {
      setTimeout(() => {
        initData();
      }, 1000);
    } else {
      initData();
    }

    

    setSocket(
      new WebSocket(
        process.env.REACT_APP_WS_URL +
          "ws/essay/" +
          "?token=" +
          cookies.get("token")
      )
    );
    setReconnectSocket(!reconnectSocket);
  }, []);

  useEffect(() => {
    if (socket === null) return;
    socket.onopen = (e) => {
      // do nothing
    };

    socket.onclose = (e) => {
      setTimeout(() => {
        setSocket(connectToSocket());
        setReconnectSocket(!reconnectSocket);
      }, 1000);
    };

    socket.onerror = (e) => {
      socket.close();
    };

    return () => {
      socket.close();
    };
  }, [reconnectSocket]);

  const connectToSocket = () => {
    const newWS = new WebSocket(
      process.env.REACT_APP_WS_URL +
        "ws/essay/" +
        "?token=" +
        cookies.get("token")
    );
    return newWS;
  };

  const initData = () => {
    const meRequest = new Request("users/me/");
    meRequest
      .then((res) => {
        setUserID(res.data.id);
        setSubscription(res.data.subscription);
        setUserInfo(res.data);
      })
      .catch((err) => {
        Sentry.captureException(err);
      });



    const interviewThreadsRequest = new Request("interviewthreads/");
    interviewThreadsRequest
      .then((res) => {
        setInterviewThreads(res.data);
        if (res.data.length !== 0) {
          setSelectedInterviewThread(res.data[0].id);
        } else {
          setSelectedInterviewThread(null);
        }
      })
      .catch((err) => {
        Sentry.captureException(err);
      });

    const threadsRequest = new Request("threads/");
    threadsRequest
      .then((res) => {
        setThreads(res.data);
        if (res.data.length !== 0) {
          setSelectedThread(res.data[0].id);
        } else {
          setSelectedThread(null);
        }
      })
      .catch((err) => {
        Sentry.captureException(err);
      });

    const freewriteThreadsRequest = new Request("freewritethreads/");
    freewriteThreadsRequest
      .then((res) => {
        setFreewriteThreads(res.data);
        setSelectedFreewriteThread(res.data[0].id);
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  };

  if (selectedThread === "") {
    return <Spinner />;
  }

  return (
    <div className="flex flex-row">
   

    

    

      <ChatModal
        open={showChatModal}
        setOpen={setShowChatModal}
        threads={threads}
        setThreads={setThreads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        socket={socket}
        setShowCTASubscribed={setShowCTASubscribed}
      />

      <Left
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        showNav={showNav}
        // chat mode
        threads={threads}
        setThreads={setThreads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        setShowChatModal={setShowChatModal}
        // freewrite mode
        freewriteThreads={freewriteThreads}
        setFreewriteThreads={setFreewriteThreads}
        selectedFreewriteThread={selectedFreewriteThread}
        setSelectedFreewriteThread={setSelectedFreewriteThread}
      
        // interview mode

        interviewThreads={interviewThreads}
        setInterviewThreads={setInterviewThreads}
        selectedInterviewThread={selectedInterviewThread}
        setSelectedInterviewThread={setSelectedInterviewThread}
        setShowInterviewModal={setShowInterviewModal}
        // show the subscribed button
        setShowCTASubscribed={setShowCTASubscribed}
        // subscribed status
        subscription={subscription}
        //show template selector
        setShowTemplateSelector={setShowTemplateSelector}
      />

      <div className="flex flex-col w-full">
        

   
{selectedMode === "imageupload" && (
          <ImageUploader
           socket={socket}
          />
        )}

{selectedMode === "imagematcher" && (
          <ImageMatcher
           socket={socket}
          />
        )}

{selectedMode === "test" && (
          <ImageGalleryTest
           socket={socket}
          />
        )}


    

        
   

   





    

      </div>
    </div>
  );
};

export default Content;
