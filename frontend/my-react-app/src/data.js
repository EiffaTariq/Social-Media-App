
export const CURRENT_USER = "Eiffa Tariq";
  export const posts = [
  {id:1, img:"https://picsum.photos/seed/nook1/500/650", cap:"Workahlic", user:"Amara K.", av:5, likes:214,owner:"Eiffa Tariq"},
  {id:2, img:"https://picsum.photos/seed/nook2/500/420", cap:"Found this staircase in Lisbon and stood there for ten minutes.", user:"Ahsam Tariq", av:12, likes:98, owner:"Ahsam Tariq"},
  {id:3, img:"https://picsum.photos/seed/nook3/500/560", cap:"Slow mornings, film grain, and a pot of coffee that took too long to make on purpose.", user:"Anzil Arshad", av:23, likes:341},
  {id:4, img:"https://picsum.photos/seed/nook4/500/480", cap:"Sea fog rolling in over the harbour at 6am.", user:"Tuba Imtiaz", av:31, likes:76,owner:"Tuba Imtiaz"},
  {id:5, img:"https://picsum.photos/seed/nook5/500/700", cap:"Nothing beats this me time at the beach.", user:"Lyba Gul", av:44, likes:512,owner:"Lyba Gul"},
  {id:6, img:"https://picsum.photos/seed/nook6/500/440", cap:"Repotted every plant in the flat. RIP to my Saturday.", user:"Anural Imtiaz", av:15, likes:64,owner:"Anural Imtiaz"},
  {id:7, img:"https://picsum.photos/seed/nook7/500/600", cap:"enjoying this peaceful view", user:"Zoey Romanoff", av:8, likes:189,owner:"Zoey Romanoff"},
  {id:8, img:"https://picsum.photos/seed/nook8/500/500", cap:"Made pasta from scratch and only cried a little.", user:"Toji Fushiguro", av:52, likes:120, owner:"Toji Fushiguro"},
];

//Weeknight ramen, extra chili oil, no regrets.
export const candidates = [
  {id:1, name:"Jiselle", age:26, img:"https://picsum.photos/seed/person1/500/650", bio:"Currently reading too many novels at once and taking the long way home. Always down for a gallery or a good playlist.", tags:["Photography","Long walks","Vinyl"], loc:"Sydney", dist:"1.4 km away", mutual:6},
  {id:2, name:"Marcus", age:29, img:"https://picsum.photos/seed/person2/500/650", bio:"Building small things with wood and bigger things with code. Trying to get better at both.", tags:["Woodworking","Coffee","Hiking"], loc:"Melbourne", dist:"3.2 km away", mutual:2},
  {id:3, name:"Ines", age:24, img:"https://picsum.photos/seed/person3/500/650", bio:"Here for the food photography and the occasional life update at 1am. Say hi.", tags:["Cooking","Film","Travel"], loc:"Brisbane", dist:"800 m away", mutual:11},
  {id:4, name:"Theo", age:31, img:"https://picsum.photos/seed/person4/500/650", bio:"Trail running most weekends, terrible at replying to messages on time, sorry in advance.", tags:["Running","Dogs","Podcasts"], loc:"Perth", dist:"5.6 km away", mutual:4},
];

export const activity = [
  {id:1, type:"like", name:"Priya R.", av:23, txt:"liked your post", thumb:"https://picsum.photos/seed/act1/100/100", time:"2m"},
  {id:2, type:"follow", name:"Theo N.", av:12, txt:"started following you", time:"18m"},
  {id:3, type:"comment", name:"Nadia S.", av:44, txt:"commented: \"this is stunning\"", thumb:"https://picsum.photos/seed/act2/100/100", time:"1h"},
  {id:4, type:"like", name:"Jules M.", av:31, txt:"liked your post", thumb:"https://picsum.photos/seed/act3/100/100", time:"3h"},
  {id:5, type:"follow", name:"Owen D.", av:15, txt:"started following you", time:"6h"},
  {id:6, type:"comment", name:"Elin V.", av:8, txt:"commented: \"where is this??\"", thumb:"https://picsum.photos/seed/act4/100/100", time:"1d"},
];

export const avatar = (n) => `https://i.pravatar.cc/150?img=${n}`;
