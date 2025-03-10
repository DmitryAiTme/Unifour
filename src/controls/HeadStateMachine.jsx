import { useState, useImperativeHandle } from "react";

export default function HeadStateMachine({ ref, mode, posts }) {
  const [currentState, setCurrentState] = useState("greeting");
  const aboutPostix = [
    {
      description: "I’m Postix! Created to help you increase your trading profits. For now, I scan only three Twitter accounts, but in the near future, I’ll become smarter and more advanced"
    },
    {
      description: "My future plans:\nAdd a notification panel to alert you whenever an account makes a new post.\nLearn how to communicate.\nDiscover what emotions are"
    },
    {
      description: "Thanks for asking"
    },
    {
      description: "Ready to dive into the world of X?"
    }
  ];
  function postixChoice(user) {
    return [
      {
        description: `Great choice! Fetching the 5 latest posts from ${user}...`
      },
      ...posts,
      {
        description: "That’s all the posts I can show for now. Want to check another account?"
      }
    ]
  };
  const postixWelcome = [
    {
      description: "Hi! Ready to dive into the world of X?"
    }
  ];
  const postixPool = [
    {
      state: "greeting",
      request: [""],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            description: "Hi! I’m Postix, your AI agent for exploring posts from popular accounts on X (Twitter)"
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
      request: ["Hi", "Hello", "Sup", "Hola"],
      answer: [
        {
          preaction: () => {},
          phrases: [postixWelcome],
          action: () => setCurrentState("begin")
        },
        {
          preaction: () => {},
          phrases: [postixWelcome],
          action: () => setCurrentState("begin")
        },
        {
          preaction: () => {},
          phrases: [postixWelcome],
          action: () => setCurrentState("begin")
        },
        {
          preaction: () => {},
          phrases: [postixWelcome],
          action: () => setCurrentState("begin")
        }
      ],
      showRequests: false
    },
    {
      state: "begin",
      request: ["Yes", "No"],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            description: "Awesome! Which account’s posts would you like to explore?"
          }]],
          action: () => setCurrentState("accounts")
        },
        {
          preaction: () => {},
          phrases: [[{
            description: "No problem! Just call me whenever you’re ready to explore X (Twitter). I'll be here"
          }]],
          action: () => setCurrentState("basic")
        }
      ],
      showRequests: true
    },
    {
      state: "accounts",
      request: ["Elon Musk", "MrBeast", "Pump Fun"],
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
      request: ["Yes", "No"],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            description: "Awesome! Which account’s posts would you like to explore?"
          }]],
          action: () => setCurrentState("accounts")
        },
        {
          preaction: () => {},
          phrases: [[{
            description: "No problem! Just call me whenever you’re ready to explore X (Twitter). I'll be here"
          }]],
          action: () => setCurrentState("basic")
        }
      ],
      showRequests: true
    },
    {
      state: "about",
      request: ["Who are you?", "Who are u?", "Who is u?", "Who is you?"],
      answer: [
        {
          preaction: () => {},
          phrases: [aboutPostix],
          action: () => setCurrentState("begin")
        },
        {
          preaction: () => {},
          phrases: [aboutPostix],
          action: () => setCurrentState("begin")
        },
        {
          preaction: () => {},
          phrases: [aboutPostix],
          action: () => setCurrentState("begin")
        },
        {
          preaction: () => {},
          phrases: [aboutPostix],
          action: () => setCurrentState("begin")
        }
      ],
      showRequests: false
    },
    {
      state: "farewell",
      request: ["Bye"],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            description: "Bye! If there are any questions - call me. I'll be here"
          }]],
          action: () => setCurrentState("begin")
        }
      ],
      showRequests: false
    },
    {
      state: "noanswer",
      request: [""],
      answer: [
        {
          preaction: () => {},
          phrases: [[{
            descriprion: "Sorry, I can't answer this question"
          }]],
          action: () => {}
        }
      ],
      showRequests: false
    }
  ];

  useImperativeHandle(ref, () => {
    return {
      searchRequest(request) {
        return findAnswer(request).phrases[0];
      },
      preaction(request) {
        findAnswer(request).preaction();
      },
      action(request) {
        findAnswer(request).action();
      }
    }
  })

  function findAnswer(request) {
    for (let i = 0; i < postixPool.length; ++i) {
      if (postixPool[i].showRequests === false || postixPool[i].state === currentState) {
        const requestsPool = postixPool[i].request.map((req) => req.toLowerCase());
        const index = requestsPool.indexOf(request.toLowerCase());
        if (index !== -1) {
          return postixPool[i].answer[index];
          i = postixPool.length;
        }
      }
    }
    return postixPool[postixPool.length - 1].answer[0]
  }
}
