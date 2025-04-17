import { useState, useImperativeHandle } from "react";

export default function HeadStateMachine({ ref, mode, posts }) {
  const [currentState, setCurrentState] = useState({
    postix: "greeting",
    flipso: "greeting",
    devix: "greeting",
    teachy: "greeting"
  });
  const welcomePattern = [
    ["Hi", "Hello", "Hola", "Hey", "Yo", "Hi there", "Hello there", "Hey there", "What's up", "Sup", "Howdy", "Hiya", "Yo yo", "Good day", "Greetings", "Heya", "Hullo", "Wassup", "Hey dude", "Morning", "Evening", "Hi everyone", "Hello folks", "Yo guys", "Hey team", "Salutations", "Bonjour", "Ciao", "Namaste", "Ola", "Ahoy", "Shalom", "Konnichiwa", "Ni hao", "Guten Tag", "Aloha", "Marhaba", "Salaam", "Zdravstvuyte", "Privet", "Merhaba", "Hej", "Sveiki", "Czesc", "Halo", "Sawasdee", "Jambo", "Hallå", "Yassas", "Annyeong", "Mabuhay", "Alô", "Servus", "Grüezi", "Dia dhuit", "Selam", "Bok", "Szia", "Tere", "Moikka", "Shwmae", "Sannu", "Moni", "Hei", "God dag"]
  ];
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
    yes: ["Yes", "Yay", "Ok", "Go", "Yep", "Yeah", "Sure", "Absolutely", "Of course", "ofc", "Definitely", "Yea", "Yup", "You bet", "For sure", "Indeed", "Totally", "Right", "Affirmative", "Sounds good", "Okay", "Alright", "Fine", "I’m in"],
    no: ["No", "Nah", "Not", "Don't", "Didn't", "Won't", "Nope", "No way", "Not really", "I don’t think so", "No, thanks", "Definitely not", "Not this time", "I’ll pass", "No, I’m good", "Not interested", "Hard no", "No, maybe later", "Negative", "Not now", "No chance", "Sorry, no", "Don’t think so", "No, I’m fine", "Sorry no"]
  };

  const unknownAnswer = [
    [{description: "Hey, I’m still under development and can’t fully understand you yet, Want to check out what’s coming next?"}],
    [{description: "Oops, I’m still a work in progress and can’t quite grasp that, Would you like a preview of my future plans?"}],
    [{description: "Yikes, I’m still in development and haven’t caught up yet, Want to see what’s on the horizon?"}],
    [{description: "Whoops, I’m still being built and can’t process that right now, How about I show you what’s coming soon?"}],
    [{description: "Ah, I’m still in the making and don’t fully understand, Want to take a look at my future features?"}],
    [{description: "Hmm, I’m still under construction and can’t quite get that, Want to see what I’m working on for the future?"}],
    [{description: "Oh no, I’m still in the process of development, How about I show you what’s coming up next?"}],
    [{description: "Oops! I’m not quite finished yet and don’t understand you fully, Want to check out what’s ahead?"}],
    [{description: "Ah, I’m still in progress and can’t fully comprehend, Want me to give you a sneak peek at what’s coming soon?"}],
    [{description: "Oh, I’m still being developed and can’t quite process that, Want to see what’s next on my list?"}]
  ];

  function updateCurrentState(newState) {
    setCurrentState((state) => {
      const buffer = {...state};
      buffer[mode] = newState;
      return buffer
    });
  }

  function postixChoice(user) {
    const postList = handlePosts(user);
    return [
      {description: `Great choice! Fetching the ${postList.length} latest posts from ${user}...`},
      ...postList,
      {description: "That's all the posts I can show for now. Want to check another account?"}
    ]
  };

  function handlePosts(user) {
    const postList = []
    for (const post of posts) {
      if (post.username === user && postList.length < 5) {
        postList.push(post)
      }
    }
    return postList
  }

  const pool = {
    postix: [
      {
        state: "greeting",
        request: [["wvkjvyvoiptag"]],
        answer: [
          {
            preaction: () => {},
            phrases: [[
              {description: "Hi! I'm Postix, your AI agent for exploring posts from popular accounts on X (Twitter)"},
              {description: "Ready to dive into the world of X? 🚀"}
            ]],
            action: () => updateCurrentState("begin")
          }
        ],
        showRequests: false
      },
      {
        state: "basic",
        request: welcomePattern,
        answer: [
          {
            preaction: () => {},
            phrases: postixDict.welcome,
            action: () => updateCurrentState("begin")
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
            phrases: [[
              {description: "Awesome! Which account's posts would you like to explore?"}
            ]],
            action: () => updateCurrentState("accounts")
          },
          {
            preaction: () => {},
            phrases: [[
              {description: "No problem! Just call me whenever you're ready to explore X (Twitter). I'll be here"}
            ]],
            action: () => updateCurrentState("basic")
          }
        ],
        showRequests: true
      },
      {
        state: "accounts",
        request: [["Elon Musk", "Elon", "Musk"], ["MrBeast", "Beast"], ["Pump Fun", "Pump", "Fun"]],
        answer: [
          {
            preaction: () => {},
            phrases: [postixChoice("elonmusk")],
            action: () => updateCurrentState("another")
          },
          {
            preaction:() => {},
            phrases: [postixChoice("MrBeast")],
            action: () => updateCurrentState("another")
          },
          {
            preaction: () => {},
            phrases: [postixChoice("pumpdotfun")],
            action: () => updateCurrentState("another")
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
            phrases: [[
              {description: "Awesome! Which account's posts would you like to explore?"}
            ]],
            action: () => updateCurrentState("accounts")
          },
          {
            preaction: () => {},
            phrases: [[
              {description: "No problem! Just call me whenever you're ready to explore X (Twitter). I'll be here"}
            ]],
            action: () => updateCurrentState("basic")
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
            action: () => updateCurrentState("begin")
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
            phrases: [[
              {description: "Bye! If there are any questions - call me. I'll be here"}
            ]],
            action: () => updateCurrentState("basic")
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
    ],
    flipso: [
      {
        state: "greeting",
        request: [["wvkjvyvoiptag", ...welcomePattern[0]]],
        answer: [
          {
            preaction: () => {},
            phrases: [[
              {description: "Hi! I'm Flipso, your AI Agent for boost your trading results!"},
              {description: "A whole team of developers is working on me right now ⚙️"},
              {description: "Want to know what they’re building?"}
            ]],
            action: () => updateCurrentState("begin")
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
            phrases: [[
              {description: "Great news! The dev team is working hard, and here’s what they’re focusing on right now:"},
              {description: "Token Audit: Performs security audits of token smart contracts to identify vulnerabilities"},
              {description: "Liquidity Dynamics Analysis: Tracks changes in liquidity pools to monitor volume, price impact, and sudden liquidity shifts"},
              {description: "Token Freeze & Transfer Verification: Checks if the token contract allows freezing of holdings and confirms unrestricted transfer capabilities"},
              {description: "Trust Score Evaluation: Generates a trust rating (e.g., 0–100)"},
              {description: "Max Supply Display: Shows the total max supply of tokens"},
              {description: "Token Holding: Reveals the distribution of tokens in different wallets."},
              {description: "The dev team is always working to upgrade my features, so keep an eye out — with every update, I’ll become even more effective at boosting your trading results!"},
              {description: "Curious to know how I can help you?"}
            ]],
            action: () => updateCurrentState("useful")
          },
          {
            preaction: () => {},
            phrases: [[
              {description: "No worries! If you change your mind, I’ve got all the dev plans ready to be shared with you. 🚀"}
            ]],
            action: () => updateCurrentState("greeting")
          }
        ],
        showRequests: true
      },
      {
        state: "useful",
        request: [patterns.yes, patterns.no],
        answer: [
          {
            preaction: () => {},
            phrases: [[
              {description: "I’m Flipso, your trusted guide to navigating the world of tokens and liquidity"},
              {description: "I’ll provide you with in-depth token audits, real-time liquidity analysis, and trust scores to help you make smarter, data-driven decisions"},
              {description: "With my insights, you’ll be equipped to enhance your trading strategy and boost your results"},
              {description: "Stay tuned for more powerful updates! 🚀"}
            ]],
            action: () => updateCurrentState("greeting")
          },
          {
            preaction: () => {},
            phrases: [[
              {description: "No problem! I’ll be here if you ever reconsider"}
            ]],
            action: () => updateCurrentState("greeting")
          }
        ],
        showRequests: true
      },
      {
        state: "unknown",
        request: [["]-304j6v7-w45i9er-6vw439=)v"]],
        answer: [
          {
            preaction: () => {},
            phrases: unknownAnswer,
            action: () => {}
          }
        ],
        showRequests: false
      }
    ],
    teachy: [
      {
        state: "greeting",
        request: [["wvkjvyvoiptag", ...welcomePattern[0]]],
        answer: [
          {
            preaction: () => {},
            phrases: [[
              {description: "Hi! I'm Teachy, your AI Agent for teach you trading strategies!"},
              {description: "A whole team of developers is working on me right now ⚙️"},
              {description: "Want to know what they’re building?"}
            ]],
            action: () => updateCurrentState("begin")
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
            phrases: [[
              {description: "Awesome! The dev team is putting in their best effort, and here’s what they’re working on right now:"},
              {description: "Trading Strategy Education: Learn the basics to get started and build a solid foundation"},
              {description: "Advanced Techniques: Elevate your skills with more sophisticated approaches"},
              {description: "Hands-on Scenarios: Dive into real-world tasks to sharpen your decision-making"},
              {description: "Practice Exercises: After each session, solidify your knowledge with tasks (A, B, C, D) to test your understanding"},
              {description: "The devs are continuously working to enhance my capabilities, so stay tuned — with each update, I’ll be even better at helping you improve your trading outcomes! 🚀"},
              {description: "Wanna know why I’ll be useful?"}
            ]],
            action: () => updateCurrentState("useful")
          },
          {
            preaction: () => {},
            phrases: [[
              {description: "Alright! If you ever reconsider, I’ve got all the developer plans waiting to be shared with you 🚀"}
            ]],
            action: () => updateCurrentState("greeting")
          }
        ],
        showRequests: true
      },
      {
        state: "useful",
        request: [patterns.yes, patterns.no],
        answer: [
          {
            preaction: () => {},
            phrases: [[
              {description: "I’m Teachy, here to guide you through the world of trading"},
              {description: "I’ll provide you with key strategies, interactive lessons, and practice tasks to sharpen your skills" },
              {description: "With me, you’ll gain the knowledge to make smarter trading decisions and improve your results"},
              {description: "Stay tuned for more updates! 🚀"}
            ]],
            action: () => updateCurrentState("greeting")
          },
          {
            preaction: () => {},
            phrases: [[
              {description: "No worries! I’ll be around if you decide to change your mind"}
            ]],
            action: () => updateCurrentState("greeting")
          }
        ],
        showRequests: true
      },
      {
        state: "unknown",
        request: [["]-304j6v7-w45i9er-6vw439=)v"]],
        answer: [
          {
            preaction: () => {},
            phrases: unknownAnswer,
            action: () => {}
          }
        ],
        showRequests: false
      },
    ],
    devix: [
      {
        state: "greeting",
        request: [["wvkjvyvoiptag", ...welcomePattern[0]]],
        answer: [
          {
            preaction: () => {},
            phrases: [[
              {description: "Hi! I'm Devix, your AI agent for wallet scanning!"},
              {description: "A whole team of developers is working on me right now ⚙️"},
              {description: "Want to know what they’re building?"}
            ]],
            action: () => updateCurrentState("begin")
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
            phrases: [[
              {description: "Awesome! Here’s what the dev team is building right now:"},
              {description: "Wallet Age Check: Analyzes how long the creator’s wallet has existed — because history matters"},
              {description: "Activity Scan: Tracks past wallet actions, so we know if we’re dealing with a seasoned player or afresh face"},
              {description: "Ownership: Reveals the percentage of tokens controlled by the creator — spotting those whales just got easier"},
              {description: "Suspicious Moves: Flags any sketchy transfers involving only created tokens — no shady business slips by us"},
              {description: "The devs are working hard on me, so stay tuned — with every update, I’ll get even better at boosting your trading results! 🚀"},
              {description: "Wanna know why I’ll be useful?"}
            ]],
            action: () => updateCurrentState("useful")
          },
          {
            preaction: () => {},
            phrases: [[
              {description: "Got it! If you change your mind, I’ve got all the dev plans ready to spill :)"}
            ]],
            action: () => updateCurrentState("greeting")
          }
        ],
        showRequests: true
      },
      {
        state: "useful",
        request: [patterns.yes, patterns.no],
        answer: [
          {
            preaction: () => {},
            phrases: [[
              {description: "The reason I’ll be useful is simple — I provide you with crucial information about wallets and their transactions"},
              {description: "With this data, you’ll have the power to make better decisions and improve your results"},
              {description: "Good luck to you. Look forward to updates :)"}
            ]],
            action: () => updateCurrentState("greeting")
          },
          {
            preaction: () => {},
            phrases: [[
              {description: "No problem! I’m here if you change your mind"}
            ]],
            action: () => updateCurrentState("greeting")
          }
        ],
        showRequests: true
      },
      {
        state: "unknown",
        request: [["]-304j6v7-w45i9er-6vw439=)v"]],
        answer: [
          {
            preaction: () => {},
            phrases: unknownAnswer,
            action: () => {}
          }
        ],
        showRequests: false
      },
    ]
  }

  useImperativeHandle(ref, () => {
    return {
      searchRequest(request) {
        const answer = findAnswer(request);
        if (answer) {
          return answer.phrases[Math.floor(Math.random() * (answer.phrases.length - 1))];
        } else {
          return [];
        }
      },
      preaction(request) {
        const answer = findAnswer(request);
        if (answer && typeof answer.preaction === 'function') {
          answer.preaction();
        }
      },
      action(request) {
        const answer = findAnswer(request);
        if (answer && typeof answer.action === 'function') {
          answer.action();
        }
      },
      getCurrentState() {
        return currentState[mode];
      },
      getCurrentRequests() {
        const stateData = pool[mode].find(state => state.state === currentState[mode]);
        return stateData ? {
          requests: stateData.request,
          showRequests: stateData.showRequests
        } : { requests: [], showRequests: false };
      }
    }
  });

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function findAnswer(request) {
    for (let i = 0; i < pool[mode].length; ++i) {
      if (
        pool[mode][i].showRequests === false ||
        pool[mode][i].state === currentState[mode]
      ) {
        const requestsPool = pool[mode][i].request.map((subreq) =>
          subreq.map((req) => req.toLowerCase())
        );
        for (let j = 0; j < requestsPool.length; ++j) {
          for (let k = 0; k < requestsPool[j].length; ++k) {
            if (
              !!requestsPool[j][k] &&
              new RegExp(
                `(^|\\s)${escapeRegExp(
                  requestsPool[j][k]
                    .replace(/[']/g, "")
                    .replace(/[^a-zA-Z]/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()
                )}(\\s|$)`,
                "i"
              ).test(request)
            ) {
              return pool[mode][i].answer[j];
            }
          }
        }
      }
    }
    return pool[mode][pool[mode].length - 1].answer[0];
  }
}
