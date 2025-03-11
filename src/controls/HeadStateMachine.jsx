import { useState, useImperativeHandle } from "react";

export default function HeadStateMachine({ ref, mode, posts }) {
  const [currentState, setCurrentState] = useState("greeting");
  const postixDict = {
    unknownAnswer: [
      [{description: "I'm not sure I understand. I'm here to monitor the buzz around X. Do you want to see the latest posts?"}],
      [{description: "Hmm, I'm not sure about that. I'm tracking X for you. Would you like to check out the updates?"}],
      [{description: "Looks like I didn't catch that. I'm keeping an eye on X. Want to see what's being said?"}],
      [{description: "Oops! I didn't quite get your message. I'm here to monitor X. Should I pull up the recent posts for you?"}],
      [{description: "Sorry, I didn't quite follow. I'm tracking X for you. Would you like to see what's trending?"}],
      [{description: "I'm not sure what you mean. I monitor X to keep you updated. Would you like to see the latest discussions?"}],
      [{description: "I didn't quite get that. I'm here to monitor X. Do you want to check out the latest tweets/posts?"}],
      [{description: "Hmm, that's a bit unclear. I track all things X. Want to see what's being said about it right now?"}],
      [{description: "Sorry, I missed that! I'm keeping an eye on X. Do you want to see the current posts or updates?"}],
      [{description: "Can you give me more info? I'm monitoring X for you. Would you like to check the latest posts or trends?"}],
    ],
    about: [
      [{description: "I'm Postix! Created to help you increase your trading profits. For now, I scan only three Twitter accounts, but in the near future, I'll become smarter and more advanced"},
      {description: "My future plans:\nAdd a notification panel to alert you whenever an account makes a new post.\nLearn how to communicate.\nDiscover what emotions are"},
      {description: "Thanks for asking"},
      {description: "Ready to dive into the world of X?"}]
    ],
    welcome: [
      [{description: "Hi! Ready to dive into the world of X?"}],
      [{description: "Hello! Excited to explore what's happening with X?"}],
      [{description: "Hey! Ready to catch the latest X vibes?"}],
      [{description: "Yo! Prepared to jump into the X universe?"}],
      [{description: "Hi there! Ready to see what's trending in X?"}],
      [{description: "Hola! Up for an adventure in the world of X?"}],
      [{description: "Greetings! Ready to dive into the X community buzz?"}],
      [{description: "Hey there! Set to explore the hype around X?"}],
      [{description: "Sup! Ready to uncover the secrets of X?"}],
      [{description: "Hi! Pumped to get into the world of X?"}]
    ]
  };

  const patterns = {
    yes: ["Yes", "Yay", "Ok", "Go", "Yep"],
    no: ["No", "Nah", "Not", "Don't", "Didn't", "Won't"]
  };

  function postixChoice(user) {
    return [
      {
        description: `Great choice! Fetching the 5 latest posts from ${user}...`
      },
      ...posts,
      {
        description: "That's all the posts I can show for now. Want to check another account?"
      }
    ]
  };

  const postixPool = [
    {
      state: "greeting",
      request: [["70w94v56-k0=]0-(863jv4907y34v5]"]],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            description: "Hi! I'm Postix, your AI agent for exploring posts from popular accounts on X (Twitter)"
          },
          {
            description: "Ready to dive into the world of X? 🚀"
          }
          ]],
          action: () => setCurrentState("begin")
        }
      ],
      showRequests: false
    },
    {
      state: "basic",
      request: [["Hi", "Hello", "Hola", "Hey", "Yo", "Hi there", "Hello there", "Hey there", "What's up", "Sup", "Howdy", "Hiya", "Yo yo", "Good day", "Greetings", "Heya", "Hullo", "Wassup", "Hey dude", "Morning", "Evening", "Hi everyone", "Hello folks", "Yo guys", "Hey team", "Salutations", "Bonjour", "Ciao", "Namaste", "Ola", "Ahoy", "Shalom", "Konnichiwa", "Ni hao", "Guten Tag", "Aloha", "Marhaba", "Salaam", "Zdravstvuyte", "Privet", "Merhaba", "Hej", "Sveiki", "Czesc", "Halo", "Sawasdee", "Jambo", "Hallå", "Yassas", "Annyeong", "Mabuhay", "Alô", "Servus", "Grüezi", "Dia dhuit", "Selam", "Bok", "Szia", "Tere", "Moikka", "Shwmae", "Sannu", "Moni", "Hei", "God dag"]],
      answer: [
        {
          preaction: () => {},
          phrases: postixDict.welcome,
          action: () => setCurrentState("begin")
        }
      ],
      showRequests: false
    },
    {
      state: "begin",
      request: [patterns.yes, patterns.no],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            description: "Awesome! Which account's posts would you like to explore?"
          }]],
          action: () => setCurrentState("accounts")
        },
        {
          preaction: () => {},
          phrases: [[{
            description: "No problem! Just call me whenever you're ready to explore X (Twitter). I'll be here"
          }]],
          action: () => setCurrentState("basic")
        }
      ],
      showRequests: true
    },
    {
      state: "accounts",
      request: [["Elon Musk", "Elon", "Musk"], ["MrBeast", "Beast"], ["Pump Fun", "Pump", "Fun"]],
      answer: [
        {
          preaction: () => {},//setUser("Elon Musk"),
          phrases: [postixChoice("Elon Musk")],
          action: () => setCurrentState("another")
        },
        {
          preaction:() => {},//setUser("MrBeast"),
          phrases: [postixChoice("MrBeast")],
          action: () => setCurrentState("another")
        },
        {
          preaction: () => {},//setUser("Pump Fun"),
          phrases: [postixChoice("Pump Fun")],
          action: () => setCurrentState("another")
        }
      ],
      showRequests: true
    },
    {
      state: "another",
      request: [patterns.yes, patterns.no],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            description: "Awesome! Which account's posts would you like to explore?"
          }]],
          action: () => setCurrentState("accounts")
        },
        {
          preaction: () => {},
          phrases: [[{
            description: "No problem! Just call me whenever you're ready to explore X (Twitter). I'll be here"
          }]],
          action: () => setCurrentState("basic")
        }
      ],
      showRequests: true
    },
    {
      state: "about",
      request: [["Who are you?", "What are you?", "Who's this?", "What's your role?", "Who am I talking to?", "Who is this?", "What are you about?", "Who's behind this?", "What's your purpose?", "Can you tell me who you are?", "Who dis?", "What's good?", "Who's on the other side?", "What's up with you?", "Who the heck are you?", "Who's talking?", "What's your deal?", "Who's this talking to me?", "What's your story?", /*"Yo, who are you?"*/, "What's your vibe?", "Who's that?", "Help!"]],
      answer: [
        {
          preaction: () => {},
          phrases: postixDict.about,
          action: () => setCurrentState("begin")
        }
      ],
      showRequests: false
    },
    {
      state: "farewell",
      request: [["Bye"]],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            description: "Bye! If there are any questions - call me. I'll be here"
          }]],
          action: () => setCurrentState("basic")
        }
      ],
      showRequests: false
    },
    {
      state: "unknown",
      request: [["]-304j6v7-w45i9er-6vw439=)v"]],
      answer: [
        {
          preaction: () => {},
          phrases: postixDict.unknownAnswer,
          action: () => {}
        }
      ],
      showRequests: false
    },
  ];


  useImperativeHandle(ref, () => {
    return {
      searchRequest(request) {
        return findAnswer(request).phrases[Math.floor(Math.random() * (findAnswer(request).phrases.length - 1))];
      },
      preaction(request) {
        findAnswer(request).preaction();
      },
      action(request) {
        findAnswer(request).action();
      },
      getCurrentState() {
        return currentState;
      },
      getCurrentRequests() {
        const stateData = postixPool.find(state => state.state === currentState);
        return stateData ? {
          requests: stateData.request,
          showRequests: stateData.showRequests
        } : { requests: [], showRequests: false };
      }
    }
  });

  function escapeRegExp(string) {
    // Escape special regex characters
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function findAnswer(request) {
    for (let i = 0; i < postixPool.length; ++i) {
      if (postixPool[i].showRequests === false || postixPool[i].state === currentState) {
        const requestsPool = postixPool[i].request.map((subreq) => subreq.map((req)=>req.toLowerCase()));
        for (let j = 0; j < requestsPool.length; ++j) {
          for (let k = 0; k < requestsPool[j].length; ++k) {
            if (!!requestsPool[j][k] && new RegExp(`(^|\\s)${escapeRegExp(requestsPool[j][k].replace(/[']/g, '').replace(/[^a-zA-Z]/g, ' ').replace(/\s+/g, ' ').trim())}(\\s|$)`, 'i').test(request)) {
              return postixPool[i].answer[j];
            }
          }
        }
      }
    }
    return postixPool[postixPool.length - 1].answer[0];
  }
}
