import post1 from "./assets/images/post1.jpeg";
import img8 from "./assets/images/img8.jfif";
import img6 from "./assets/images/img6.jpeg";
import img3 from "./assets/images/img3.jpeg";
import img4 from "./assets/images/img4.jpeg";
import img5 from "./assets/images/img5.jpeg";
import img7 from "./assets/images/img7.jpeg";
//import { CURRENT_USER_ID } from "../src/currentUser.js";
import profilePic from "./assets/images/profile.jfif";
import { usePosts } from "../src/context/PostsContext.jsx";

export const CURRENT_USER = "Eiffa Tariq";
export const CURRENT_USER_AVATAR = profilePic;


  export const posts = [
  {id:1, img:post1, cap:"enjoying this me time", user:"Eiffa Tariq", av:5, likes:214,owner:"Eiffa Tariq"},
  {id:2, img:img8, cap:"Made pasta from scratch and only cried a little.", user:"Toji Fushiguro", av:52, likes:120, owner:"Toji Fushiguro"},
  {id:3, img:img3, cap:"Slow mornings, film grain, and a pot of coffee that took too long to make on purpose.", user:"Anzil Arshad", av:23, likes:341},
  {id:4, img:img4, cap:"Sea fog rolling in over the harbour at 6am.", user:"Tuba Imtiaz", av:31, likes:76,owner:"Tuba Imtiaz"},
  {id:5, img:img5, cap:"Nothing beats this me time at the beach.", user:"Lyba Gul", av:44, likes:512,owner:"Lyba Gul"},
  {id:6, img:img6, cap:"Repotted every plant in the flat. RIP to my Saturday.", user:"Anural Imtiaz", av:15, likes:64,owner:"Anural Imtiaz"},
  {id:7, img:img7, cap:"enjoying this peaceful view", user:"Zoey Romanoff", av:8, likes:189,owner:"Zoey Romanoff"},
  {id:8, img:"https://picsum.photos/seed/nook2/500/420", cap:"Workahlic", user:"Ahsam Tariq", av:12, likes:98, owner:"Ahsam Tariq"},
  
];

export const activity = [
  {id:1, type:"like", name:"Tuba Imtiaz", av:23, txt:"liked your post", thumb:"https://picsum.photos/seed/act1/100/100", time:"2m"},
  {id:2, type:"follow", name:"Toji Fushiguro", av:12, txt:"started following you", time:"18m"},
  {id:3, type:"comment", name:"Lyba Gul", av:44, txt:"commented: \"this is stunning\"", thumb:"https://picsum.photos/seed/act2/100/100", time:"1h"},
  {id:4, type:"like", name:"Jules M.", av:31, txt:"liked your post", thumb:"https://picsum.photos/seed/act3/100/100", time:"3h"},
  {id:5, type:"follow", name:"Zoey Romanoff", av:15, txt:"started following you", time:"6h"},
  {id:6, type:"comment", name:"Ahsam Tariq", av:8, txt:"commented: \"where is this??\"", thumb:"https://picsum.photos/seed/act4/100/100", time:"1d"},
];

export const avatar = (n) => `https://i.pravatar.cc/150?img=${n}`;
