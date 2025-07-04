import React, { useState } from "react";
import axios from "axios";
import { PinataSDK } from "pinata-web3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Switch = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
            block w-14 h-8 rounded-full transition-colors duration-300
            ${checked ? "bg-blue-600" : "bg-gray-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
        <div
          className={`
            absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300
            ${checked ? "transform translate-x-6" : "transform translate-x-0"}
          `}
        />
      </div>
      {label && (
        <span className={`ml-3 ${disabled ? "opacity-50" : ""}`}>{label}</span>
      )}
    </label>
  );
};

const CreateToken = () => {
  const navigate = useNavigate();
  const [hiddenSocial, setHiddenSocial] = useState(false);
  const [ipfsURL, setIpfsURL] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [revokeMeta, setRevokeMeta] = useState(true);
  const [freeAuth, setFreezeAuth] = useState(true);
  const [revokeMint, setRevokeMint] = useState(true);
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [pinataUsageFlag, setPinataUsageFlag] = useState(false);
  // const [discord, setDiscord] = useState("");

  const [selectedFile, setSelectedFile] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pinata = new PinataSDK({
    pinataJwt: `${process.env.REACT_APP_PINATA_JWT}`,
    pinataGateway: `${process.env.REACT_APP_PINITA_GATEWAY_URL}`,
  });

  const changeHandler = (event) => {
    setSelectedFile(event.target?.files?.[0]);

    if (event.target?.files?.[0]) {
      const previewUrl = URL.createObjectURL(event.target?.files?.[0]);
      setImagePreview(previewUrl);
    }
  };

  const toggleRevokeMeta = () => {
    setRevokeMeta(!revokeMeta);
  };

  const toggleFreezeAuth = () => {
    setFreezeAuth(!freeAuth);
  };

  const toggleRevokeMint = () => {
    setRevokeMint(!revokeMint);
  };

  const toggleSocialLinks = () => {
    setHiddenSocial(!hiddenSocial);
  };

  const handleTotalSupplyChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setTokenSupply(value);

    const formattedValue = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    setFormattedValue(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the input
    if (!tokenName || !symbol || !description || !tokenSupply) {
      toast.warning(
        "Token Name, Symbol, decimal, supply, and token Description are required!",
        {
          autoClose: 2000,
        }
      );
      return;
    }

    if (!selectedFile) {
      toast.warning("Please select a file to upload", {
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    let image = tokenImage;
    if (pinataUsageFlag) {
      const upload = await pinata.upload.file(selectedFile);
      image = `https://ipfs.io/ipfs/${upload.IpfsHash}`;
    }

    const tokenData = {
      tokenName,
      symbol,
      description,
      image,
      website: hiddenSocial ? "" : website,
      twitter: hiddenSocial ? "" : twitter,
      telegram: hiddenSocial ? "" : telegram,
      // discord: hiddenSocial ? "" : discord
    };

    try {
      const response = await axios.post(
        "http://170.130.165.249:3001/mint/",
        {
          tokenInfo: tokenData,
          pinataUsageFlag,
          ipfsURL,
          tokenSupply,
          revokeMeta,
          freeAuth,
          revokeMint,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // toast.success(`Token created Successfully!`, {
      //   autoClose: 2000,
      // });

      // toast.success(`Token address is ${response.data.mintResult}`, {
      //   autoClose: false,
      // });
      navigate(`/bot?baseTokenAddress=${response.data.mintResult}`);
      console.log("Token created successfully", response.data.mintResult);
    } catch (error) {
      // Improved error handling
      toast.error(`Error: ${error.message}`, {
        autoClose: 2000,
      });
      console.error("Error creating token:", error);
    } finally {
      setIsSubmitting(false);
      setTokenName("");
      setSymbol("");
      setDescription("");
      setTokenSupply("");
      setImagePreview(null);
      setRevokeMeta(true);
      setFreezeAuth(true);
      setRevokeMint(true);
      setWebsite("");
      setTelegram("");
      setTwitter("");
    }
  };

  const handleAutoFill = async (e) => {
    e.preventDefault();
    if (ipfsURL === "") {
      toast.warning("Please input URL first!", {
        autoClose: 2000,
      });
      return;
    }
    const result = await axios.get(ipfsURL);
    if (result.status === 200) {
      const data = result.data;
      console.log(data);
      setSymbol(data?.symbol || "");
      setTokenName(data?.name || "");
      setDescription(data?.description || data?.symbol + " is the best!");
      setTokenImage(data?.image || "");
      if (data?.website) setWebsite(data?.website);
      if (data?.twitter) setTwitter(data?.twitter);
      if (data?.telegram) setTelegram(data?.telegram);
      if (data?.websites && data?.websites.length > 0)
        setWebsite(data?.websites[0]?.url || "");
      if (data?.socials && data?.socials.length > 0) {
        await data?.socials.forEach((item) => {
          switch (item?.type) {
            case "twitter":
              setTwitter(item?.url);
              break;
            case "telegram":
              setTelegram(item?.url);
              break;
          }
        });
      }
      if (data?.image) {
        const response = await axios({
          method: "get",
          url: data?.image,
          responseType: "blob",
        });

        const imageURL = URL.createObjectURL(response.data);
        const contentType = response.headers["content-type"];
        const ext = contentType ? contentType.split("/")[1] : "webp";
        const file = new File([response.data], "image." + ext, {
          type: contentType,
        });
        setImagePreview(imageURL);
        setSelectedFile(file);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full h-[calc(100vh-100px)] bg-[#FFFEFD] justify-center overflow-y-scroll scroll-hide"
    >
      <ToastContainer />
      <div className="mx-[7%] flex w-full h-auto flex-col">
        <div className="w-full border-b-2 border-solid border-[#EBEBEB] justify-between items-start flex flex-row mt-10 pb-4">
          <p className="text-2xl font-medium">Solana Token Creation</p>
          <div className="flex flex-row items-center gap-2 w-[200px] justify-between">
            <Switch checked={pinataUsageFlag} onChange={setPinataUsageFlag} />
            <p className="text-1xl font-medium">
              {pinataUsageFlag ? "Use Pinata" : "Don't use Pinata"}
            </p>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col mt-12">
          <div className="flex flex-row w-full gap-5 mb-6 justify-center items-center">
            <p className="text-lg font-medium">IPFS URL</p>
            <input
              className="flex-1 bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter IPFS URL"
              type="text"
              value={ipfsURL}
              onChange={(e) => setIpfsURL(e.target.value)}
            />
            <button
              type="button"
              className={`transition-all active:scale-90 text-base px-4 py-3 rounded-lg cursor-pointer flex items-center justify-center text-white font-semibold border border-[#a27be0] hover:bg-violet-500 bg-violet-700`}
              onClick={handleAutoFill}
            >
              Auto Fill
            </button>
          </div>

          <div className="w-[48%] flex flex-col mb-6">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Token Name
            </p>
            <input
              className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter Token Name"
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-row justify-between items-center mb-6">
            <div className="flex flex-col w-[48%]">
              <div className="w-full flex flex-col mb-6">
                <p className="mb-2 text-lg font-medium">
                  <span className="text-[#ff0000] mr-2">*</span>Token Symbol
                </p>
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="Enter Total of Token Supply. exp. 1,000,000,000"
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </div>
              <div className="w-full flex flex-col">
                <p className="mb-2 text-lg font-medium">
                  <span className="text-[#ff0000] mr-2">*</span>Token Supply
                </p>
                <input
                  className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                  placeholder="Enter Total of Token Supply. exp. 1,000,000,000"
                  type="text"
                  value={formattedValue}
                  onChange={handleTotalSupplyChange}
                />
              </div>
            </div>
            <div className="w-[48%] flex flex-col">
              <p className="mb-2 text-lg font-medium">
                <span className="text-[#ff0000] mr-2">*</span>Token Logo
              </p>
              <div className="bg-[#fff] transition-all active:border-[#8b5cf6] flex flex-row justify-between items-center border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[20px_30px] text-[16px] text-[#3a3c4b]">
                <input
                  className="hidden"
                  id="file-input"
                  type="file"
                  onChange={changeHandler}
                />
                <label
                  className="w-[110px] overflow-hidden h-[110px] cursor-pointer bg-[#FAFAFA] flex justify-center items-center rounded-xl border border-dashed border-[#EBEBEB] hover:border-[#8b5cf6] transition-all"
                  htmlFor="file-input"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Uploaded Preview"
                      className="w-[110px] h-[110px] rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-center text-[#8b5cf6]">
                      Upload File
                    </span>
                  )}
                </label>
                <div className="flex h-[100px] flex-col justify-between w-[75%]">
                  <div className="flex flex-col font-normal text-[12px]">
                    <p>Supported image formats: PNG/GIF/JPG/WEBP and JPEG</p>
                    <p>Recommended size: 1000×1000 pixels</p>
                  </div>
                  <p className="font-normal text-[12px] text-black/60">
                    If it meets the above requirements, it can be better
                    displayed on various platforms and applications
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-between items-start my-6">
            <p className="mb-2 text-lg font-medium">
              <span className="text-[#ff0000] mr-2">*</span>Token Description
            </p>
            <textarea
              className="bg-[#fff] w-full h-[150px] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
              placeholder="Enter Token Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="h-[70px] w-full border-b-2 border-solid border-[#EBEBEB] justify-start items-center flex flex-row mb-5">
            <p className="text-xl font-medium mr-3">Add Social Links</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer z-0"
                onChange={toggleSocialLinks}
                checked={!hiddenSocial}
              />
              <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700" />
            </label>
          </div>
          {!hiddenSocial && (
            <>
              <div className="w-full flex flex-row justify-between items-center mt-6">
                <div className="w-[48%] flex flex-col">
                  <p className="mb-2 text-lg font-medium">Website:</p>
                  <input
                    className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                    placeholder="Enter Your Website URL"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="w-[48%] flex flex-col">
                  <p className="mb-2 text-lg font-medium">X:</p>
                  <input
                    className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                    placeholder="Enter your X Link"
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full flex flex-row justify-between items-center mt-6">
                <div className="w-[48%] flex flex-col">
                  <p className="mb-2 text-lg font-medium">Telegram:</p>
                  <input
                    className="bg-[#fff] focus:border-[#8b5cf6] transition-all active:border-[#8b5cf6] border border-solid outline-none border-[#EBEBEB] rounded-[6px] p-[10px_15px] text-[16px] text-[#3a3c4b]"
                    placeholder="Enter Your Telegram Link"
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="flex flex-row w-full justify-between items-center mt-12">
            <div
              className={`${revokeMeta ? "border-[#8b5cf6]" : "border-[#F6F6F6]"
                } flex w-[30%] h-[250px] bg-[#F6F6F6] rounded-md items-center justify-center transition-all border border-solid`}
            >
              <div className="w-[calc(100%-50px)] h-[calc(100%-50px)] flex  flex-col ">
                <div className="w-full flex flex-row items-center justify-between border-b border-solid pb-4 border-[#EBEBEB]">
                  <p className="text-xl font-semibold">
                    Revoke Update (Immutable)
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      onChange={toggleRevokeMeta}
                      checked={revokeMeta}
                    />
                    <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700" />
                  </label>
                </div>
                <p className="text-[#666] font-medium text-[20px] leading-8 mt-4">
                  Revoke Update (Immutable)
                </p>
              </div>
            </div>
            <div
              className={`${freeAuth ? "border-[#8b5cf6]" : "border-[#F6F6F6]"
                } flex w-[30%] h-[250px] bg-[#F6F6F6] rounded-md items-center justify-center transition-all border border-solid`}
            >
              <div className="w-[calc(100%-50px)] h-[calc(100%-50px)] flex  flex-col ">
                <div className="w-full flex flex-row items-center justify-between border-b border-solid pb-4 border-[#EBEBEB]">
                  <p className="text-xl font-semibold">Revoke Freeze</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      onChange={toggleFreezeAuth}
                      checked={freeAuth}
                    />
                    <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700" />
                  </label>
                </div>
                <p className="text-[#666] font-medium text-[20px] leading-8 mt-4">
                  Revoke Freeze
                </p>
              </div>
            </div>
            <div
              className={`${revokeMint ? "border-[#8b5cf6]" : "border-[#F6F6F6]"
                } flex w-[30%] h-[250px] bg-[#F6F6F6] rounded-md items-center justify-center transition-all border border-solid`}
            >
              <div
                className={`w-[calc(100%-50px)] h-[calc(100%-50px)] flex  flex-col`}
              >
                <div className="w-full flex flex-row items-center justify-between border-b border-solid pb-4 border-[#EBEBEB]">
                  <p className="text-xl font-semibold">Revoke Mint</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      onChange={toggleRevokeMint}
                      checked={revokeMint}
                    />
                    <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700" />
                  </label>
                </div>
                <p className="text-[#666] font-medium text-[20px] leading-8 mt-4">
                  Revoke Mint
                </p>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-12 mb-12 transition-all active:scale-90 text-base px-4 py-3 rounded-lg cursor-pointer ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-violet-500 bg-violet-700"
              } flex items-center justify-center text-white font-semibold border border-[#a27be0]`}
          >
            {isSubmitting ? "Creating Token..." : "Create Token"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateToken;
