import React, { useEffect, useState } from "react";
import Left from "./Left";
import Center from "./Center";
import Spinner from "./Spinner";
import Request from "./Request";
import FreeWrite from "./FreeWrite";
import Settings from "./Settings";
import Resources from "./Resources";
import LandingPage from "./LandingPage";
import LandingPage2 from "./LandingPage2";
import LandingPageMain from "./LandingPageMain";
import Profile from "./Profile";
import Cookies from "universal-cookie";
import CTASubscribeModal from "./CTASubscribeModal";

import Interview from "./Interview";

import InterviewInputModal from "./Interview/InterviewInputModal";
import ChatModal from "./Center/ChatModal";
import { useAuth0 } from "@auth0/auth0-react";
import * as Sentry from "@sentry/react";
import studentData from "./studentData.json";
import SuperPal from "./SuperPal";
import ProfileMatcher from "./ProfileMatcher";
import EssayMatcher from "./EssayMatcher";
import ExtracurricularDisplay from "./ExtracurricularDisplay";
import AwardsDisplay from "./AwardsDisplay";
import CollegeDatabase from "./CollegeDatabase";
import YourColleges from "./YourColleges";
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
    return localStorage.getItem("selectedMode") || "profile";
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

  //set the current template for create
  const [selectedTemplate, setSelectedTemplate] = useState("");

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
      <CTASubscribeModal
        open={showCTASubscribed}
        setShowCTASubscribed={setShowCTASubscribed}
        setSelectedMode={setSelectedMode}
      />

    

      <InterviewInputModal
        open={showInterviewModal}
        setOpen={setShowInterviewModal}
        interviewThreads={interviewThreads}
        setInterviewThreads={setInterviewThreads}
        selectedInterviewThread={selectedInterviewThread}
        setSelectedInterviewThread={setSelectedInterviewThread}
        socket={socket}
      />

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
        {selectedMode === "chat" &&
          (threads.length > 0 || showTemplateSelector === true) && (
            <>
              <Center
                threads={threads}
                setThreads={setThreads}
                selectedThread={selectedThread}
                setSelectedThread={setSelectedThread}
                socket={socket}
                setShowCTASubscribed={setShowCTASubscribed}
                freewriteThreads={freewriteThreads}
                setFreewriteThreads={setFreewriteThreads}
                setSelectedFreewriteThread={setSelectedFreewriteThread}
                setSelectedMode={setSelectedMode}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                showTemplateSelector={showTemplateSelector}
                setShowTemplateSelector={setShowTemplateSelector}
              />
            </>
          )}

        {selectedMode === "default" && (
          <LandingPageMain
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            setShowTemplateSelector={setShowTemplateSelector}
            setShowInterviewModal={setShowInterviewModal}
          />
        )}

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


        {selectedMode === "chat" &&
          threads.length === 0 &&
          showTemplateSelector === false && (
            <LandingPage
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              setShowTemplateSelector={setShowTemplateSelector}
              setShowInterviewModal={setShowInterviewModal}
            />
          )}

        {selectedMode === "freewrite" && (
          <FreeWrite
            freewriteThreads={freewriteThreads}
            setFreewriteThreads={setFreewriteThreads}
            selectedFreewriteThread={selectedFreewriteThread}
            setSelectedFreewriteThread={setSelectedFreewriteThread}
            socket={socket}
            setShowCTASubscribed={setShowCTASubscribed}
          />
        )}

     

        {selectedMode === "interview" && interviewThreads.length > 0 && (
          <Interview
            interviewThreads={interviewThreads}
            setInterviewThreads={setInterviewThreads}
            selectedInterviewThread={selectedInterviewThread}
            setSelectedInterviewThread={setSelectedInterviewThread}
            socket={socket}
            setShowCTASubscribed={setShowCTASubscribed}
          />
        )}

        {selectedMode === "interview" && interviewThreads.length === 0 && (
          <LandingPage2
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            setShowTemplateSelector={setShowTemplateSelector}
            setShowInterviewModal={setShowInterviewModal}
          />
        )}

        {selectedMode === "settings" && (
          <Settings
            subscription={subscription}
            userID={userID}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        )}

        {selectedMode === "resources" && <Resources />}

        {selectedMode === "profile" && 
        
        <SuperPal
          socket={socket}
          gender = {gender}
          setGender = {setGender}
          race = {race}
          setRace = {setRace}
          intendedMajor = {intendedMajor}
          setIntendedMajor = {setIntendedMajor}
          satScore = {satScore}
          setSatScore = {setSatScore}
          actScore = {actScore}
          setActScore = {setActScore}
          unweightedGpa = {unweightedGpa}
          setUnweightedGpa = {setUnweightedGpa}
          extracurriculars = {extracurriculars}
          setExtracurriculars = {setExtracurriculars}
          awards = {awards}
          setAwards = {setAwards}
          selectedInterests = {selectedInterests}
          setSelectedInterests = {setSelectedInterests}
          change = {change}
          setChange = {setChange}
          setSelectedMode = {setSelectedMode}
         
        />
        
        }


        {selectedMode === "studentprofiles" && (
          <Profile
            student={student}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
          />
        )}

        {selectedMode === "profilematcher" && (
          <ProfileMatcher
            socket={socket}
            gender={gender}
            race={race}
            intendedMajor={intendedMajor}
            satScore={satScore}
            actScore={actScore}
            unweightedGpa={unweightedGpa}
            extracurriculars={extracurriculars}
            awards={awards}
            selectedInterests={selectedInterests}
            setSelectedMode={setSelectedMode}
           
        />
          
        )}

{selectedMode === "essaymatcher" && (
          <EssayMatcher
            socket={socket}
            gender={gender}
            unweightedGpa={unweightedGpa}
            extracurriculars={extracurriculars}
            setSelectedMode={setSelectedMode}
        />
          
        )}

{selectedMode === "ecs" && (
          <ExtracurricularDisplay
            
        />
          
        )}

{selectedMode === "awards" && (
          <AwardsDisplay
            
        />

        
          
        )}
        {selectedMode === "collegedatabase" && (
          <CollegeDatabase
            
        />)}

{selectedMode === "yourcolleges" && (
          <YourColleges
            
        />)}
      </div>
    </div>
  );
};

export default Content;
