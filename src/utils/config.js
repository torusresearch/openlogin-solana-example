import { base64url } from "@toruslabs/openlogin-utils";
import { whitelistUrl } from "@toruslabs/openlogin";
import { generatePrivate, getPublic } from "@toruslabs/eccrypto";
const GOOGLE = "google";
export const verifiers = {
  [GOOGLE]: {
    name: "Google",
    typeOfLogin: "google",
    verifier: "google-lrc",
    // refer helper functions given below to generate origin specific
    // clientId and sig.
    // Note: this example client id and sig works only if your app is running on localhost only.
    // generally you won't need clientId and sig for localhost. But for other domains you have to
    // generate client id and sig using helper methods (generateClientCreds, whitelistOrigin) given
    // below.
    clientId : "BJvYm-VGiNRpH2DhFMibRGLCG8B54oSdQoQD_58S8dUAYEaHhfGsHWIwQQ2yPJWMtTvMtcC1ykifJXmAJ1tztBM",
    sig: "MEUCIQDz5wefYPM6bH5I3lNOi65M0dE_RravxOQUZ7HN8ZYicwIgSh06a1Gg1fGAKp0zTIxp42fDzUvxlQ_KcIbyycBP0DQ",
  },
};

// helper methods to generate clientId and appKey
export const generateClientCreds = async ()=>{
  let priv = generatePrivate()
  let pub = getPublic(priv)
  let clientId = base64url.encode(pub)
  return { clientId, appKey: priv.toString("hex") };
}

// helper method to generate origin verification signature
// first generateClientCreds and then use this function to
// get verification signature.
// this client signature and client id will be used in openlogin login method.
// Note: Don't store your appKey in frontend. Just use it to create signature.
export const whitelistOrigin = async (clientId, appKey)=>{
   const sig = await whitelistUrl(clientId, appKey, window.location.origin);
   return sig;
}