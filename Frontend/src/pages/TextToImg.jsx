import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Logo from '../reuseablecomponents/Logo';
import {auth} from '../firebase';
import { Link } from 'react-router-dom';

const DEFAULT_PROMPT = "A young girl eating pizza";


export default function Lightning() {
  
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [activeArtStyle, setActiveArtStyle] = useState("");
  const [activeAspectRatio, setActiveAspectRatio] = useState("1/1");
  const [loading, setLoading] = useState(false);
  const [activeDiffusionInferenceSteps, setActiveDiffusionInferenceSteps] = useState("4");
  const [currentUser, setCurrentUser] = useState({ name: "", email: "" });

  const [isNSFW, setIsNSFW] = useState(false);
  const NSFW_PLACEHOLDER = '/assets/nsfw.jpeg';

  const timer = useRef | undefined;

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            setCurrentUser({ name: user.displayName, email: user.email });
        } else {
            // User is signed out
            setCurrentUser({ name: "", email: "" });
        }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
}, []);

const handleLogout = () => {
  auth.signOut().then(() => {
      console.log("User signed out.");
      localStorage.setItem("status",false);
      this.props.history.push('/');
    
    }).catch((error) => {
      console.error("Sign Out Error", error);
  });
};

  const handleOnChange = async (prompt) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setPrompt(prompt);
  };
  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt before sending.");
      return;
    }
    setLoading(true);
    const newPrompt = activeArtStyle ? `${prompt}, ${activeArtStyle}` : prompt;
  
    try {
      const res = await axios.post("https://digital-art-backend-pcu8.onrender.com/digitalart/text-to-art", {
        prompt: newPrompt,
        diffusionInferenceSteps: activeDiffusionInferenceSteps,
      });
      if (res.status === 200) {
        if (res.data.has_nsfw_concepts.includes(true)) {
          // Handle NSFW content
          setIsNSFW(true); // Update state to reflect NSFW content
          setImage(NSFW_PLACEHOLDER); // Optionally clear the image if NSFW
          alert("Model generated content deemed unsafe for university work. Displaying this content is restricted."); // Alert user
        } else {
          setImage(res.data.images[0].url); // Display image if safe
          setIsNSFW(false); // Reset NSFW state if content is safe
        }
      }
    } catch (e) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  
  const downloadImageWithAspectRatio = async (imageUrl, aspectRatio) => {
    const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
  
    // Set image load as a promise to wait for it to be loaded before drawing
    const imageLoadPromise = new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });
  
    image.src = imageUrl;
    await imageLoadPromise; // Wait for image to load
  
    // Calculate new canvas size to maintain aspect ratio
    const canvasWidth = image.width;
    const canvasHeight = (canvasWidth / widthRatio) * heightRatio;
  
    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  
    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  
    // Convert canvas to data URL and trigger download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${aspectRatio.replace('/', 'x')}.png`; // Name the file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };



  useEffect(() => {
    handleSendPrompt();
  }, []);

  return (
    <>
 <div className="flex flex-row flex-wrap bg-blue-50">
                <div className="basis-4/6 lg:basis-5/6 py-3 px-5">
                <Link to="/">
            <Logo />
        </Link>                </div>

                {currentUser.email && (
                    <div className="lg:basis-1/6 py-3 basis-2/6 pt-8 font-bold">
                        <div className="dropdown">
                            <img src="assets/avatar.png" alt="profile" width={50} height={50} style={{ cursor: "pointer" }} />
                            <div className="dropdown-content">
                                <h4 className="text-cyan-600 p-2 hover:text-cyan-400 text-sm hover:cursor-pointer">
                                    {currentUser.name || currentUser.email}
                                </h4>
                                <h4 className="text-cyan-600 p-2 hover:text-cyan-400 text-sm hover:cursor-pointer" onClick={handleLogout}>
                                    Logout
                                </h4>
                            </div>
                        </div>
                    </div>
                )}
            </div>
      <main className="bg-white h-screen w-full p-[50px]">
        <div className="flex flex-row items-start justify-between gap-5">
        <div className="flex flex-row items-start justify-start gap-5 w-full">
            <div className="md:w-[55%]">
              <div>
                <label className="text-[15px] text-cyan-600 font-[600]">
                  Prompt
                </label>
                <div className="flex flex-row items-center gap-3">
                  <input
                    className="w-full border rounded-[7px] h-[45px] p-3 font-[400]"
                    placeholder="Type something..."
                    value={prompt}
                    onChange={(e) => {
                      handleOnChange(e.target.value);
                    }}
                  />
                  <button
                    onClick={handleSendPrompt}
                    className="w-[150px] h-[45px] bg-cyan-600 text-white rounded-lg font-bold"
                    disable={loading}
                  >
                    {loading ? "loading..." : "Send"}
                  </button>
                </div>
              </div>
              <div className="mt-5 font-[600]">
                <label className="text-[15px] text-cyan-600">Art style</label>

                <div className="flex flex-row items-center flex-wrap gap-3 w-full">
                  {[
                    "Anime",
                    "Pixer",
                    "Neon",
                    "Black and White",
                    "Cartoonize",
                    "Low Poly",
                  ].map((val) => {
                    return (
                      <button
                        key={val}
                        onClick={() => {
                          setActiveArtStyle(val);
                        }}
                        className={`w-[150px] h-[45px] mt-2 rounded-lg font-bold ${
                          val == activeArtStyle
                            ? "bg-cyan-600 text-white"
                            : "bg-[#EFF6FF] text-cyan-600"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-7 font-[600]">
                <label className="text-[15px] text-cyan-600">
                  Aspect ratio
                </label>

                <div className="flex flex-row items-center flex-wrap gap-3 w-full">
                  {["1/1", "4/5", "5/4", "3/4", "4/3"].map((val) => {
                    return (
                      <button
                        key={val}
                        onClick={() => {
                          setActiveAspectRatio(val);
                        }}
                        className={`w-[150px] h-[45px] mt-2 rounded-lg font-bold ${
                          val == activeAspectRatio
                            ? "bg-cyan-600 text-white"
                            : "bg-[#EFF6FF] text-cyan-600"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>

       
              <div className="mt-5 font-[600]">
              <label className="text-[15px] text-cyan-600">Diffusion Inference Steps</label>

              <div className="flex flex-row items-center flex-wrap gap-3 w-full">
                {["1", "2", "4", "8"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setActiveDiffusionInferenceSteps(val)}
                    className={`w-[150px] h-[45px] mt-2 rounded-lg font-bold ${
                      val === activeDiffusionInferenceSteps ? "bg-cyan-600 text-white" : "bg-[#EFF6FF] text-cyan-600"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="mt-12 font-[600]">
                              <label className="text-[20px] text-cyan-600">Important Notes:</label>

                <ul className="list-disc list-inside ml-6 mr-6 mt-4 p-4 rounded-lg bg-gradient-to-r from-cyan-700 to-blue-800 text-white shadow-lg">
                  <li>The generation quality of 2-step, 4-step, and 8-step inference is amazing. However, the 1-step model is more experimental.</li>
                </ul>
                <ul className="list-disc list-inside ml-6 mr-6 mt-4 p-4 rounded-lg bg-gradient-to-r from-cyan-700 to-blue-800  text-white shadow-lg">
                <li>Higher diffusion inference steps can produce more detailed images but may take longer to generate.</li>
                </ul>
                <ul className="list-disc list-inside ml-6 mr-6 mt-4 p-4 rounded-lg bg-gradient-to-r from-cyan-700 to-blue-800  text-white shadow-lg">
                  <li>If you see no image, Its just that we filtered the NWFS content (Not safe for work) to make the website suitable for kids too.</li>
                </ul>
                </div>
            </div>
            </div>

            <div className="mt-2 md:w-[35%]  border-2 border-gray-300">
              {image && (
                <img
                  id="imageDisplay"
                  src={image}
                  alt="Dynamic Image"
                  className="object-cover w-full h-full rounded-[7px] img-fluid shadow-md"
                  style={{ aspectRatio: activeAspectRatio }}
                />
              )}
            {image && (
  <button
    className="mt-2 w-[150px] h-[45px] bg-cyan-600 text-white rounded-lg font-bold flex items-center justify-center"
    onClick={() => downloadImageWithAspectRatio(image, activeAspectRatio)}
  >
    Download Image
  </button>
)}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
