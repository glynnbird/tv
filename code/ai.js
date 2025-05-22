

import { okResponse, notOkResponse, missingResponse, notOk } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey, handleCORS } from './lib/checks.js'

const prompt = `Please summarise the following text as JSON 
  and return the title of the TV programme, five cast members, 
  the number of episodes, the channel it is broadcast on in the UK, 
  the first date of broadcast in the UK and a synopsis of what 
  it's about, as a JSON object please. Please return a JSON object 
  and nothing else.`

export async function onRequest(context) {
  // handle POST/JSON/apikey chcecks
  const r = handleCORS(context.request) || apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r
  
  const txt = `
  New drama The Bombing of Pan Am 103 tells the true story surrounding the aftermath of the 1988 Lockerbie bombing, and has been produced as a collaboration between the BBC, Netflix, MGM and World Productions.

Simon Heath, CEO and creative director of World Productions, which has also been behind shows such as Line of Duty and Vigil, recently opened up about the drama when speaking at a Q&A, saying it was a "drama that needed to be seen".

He said: "I read the pilot, I think it was in 2021. And I thought I knew a reasonable amount about the Lockerbie story, and realised reading just the first script, and then Adam [Morane-Griffiths, executive producer]'s brilliant research document, that I didn't.

"There was an awful lot more to this story. There were voices that hadn't been heard, there were stories that hadn't been told. There was a whole scale of investigation that had been overlooked, and it felt like it was a story that needed to be told and a drama that needed to be seen."
Tony Curran as DCI Harry Bell, Patrick J Adams as Dick Marquise, Peter Mullan as DCS John Orr and Connor Swindells as DS Ed McCusker in The Bombing of Pan Am 103. Adams and Swindells are shaking hands
The Bombing of Pan Am 103. BBC/World Productions

The series features an ensemble cast led by Connor Swindells and Patrick J Adams, and follows a number of real-life figures whose stories have been dramatised, including their characters police officer Ed McCusker and FBI special agent Dick Marquise.
More like this

Heath also spoke about why the project needed to be a collaboration between so many partners, saying: "There was a challenge of finding the home for the project.

"I knew the BBC had had a number of Lockerbie projects in development over the last 20 years, and so what I was banking on was that they would have the same response as me, which ‘This is a unique angle. These are stories that haven't been told.’

"And fortunately, when Gaynor Holmes at BBC Scotland read the script, she felt the same way. And it felt like a script that went through the BBC very, very quickly. Everyone read it, recognised the importance of the story, recognised that the timing was right, that the angle on the story was right, and that it's something that should get made.

"So we got the BBC on board, and then the scale of this kind of drama needs big resources. It needs international backing. It can't just be UK. And fortunately, I knew the team at Netflix very well, Anne Mensah, Mona Qureshi, Manda Levin, and they all responded really quickly to the story as well, and came on board as our partners.

"It's a pretty unique collaboration between MGM, BBC, Netflix and us [World Productions], but it's needed that scale of production to bring it to the screen."
Be the first to get the latest drama news, direct to your inbox

Keep up to date with all the dramas - from period to crime to comedy
Email address

By entering your details you are agreeing to our terms and conditions and privacy policy. You can unsubscribe at any time.

This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.

The Lockerbie bombing, which saw a plane en route from Heathrow to JFK being bombed, was the worst ever terror attack on British soil and the first major act of terrorism against US citizens, and left 270 people dead.

The series follows the story of the Scots-US investigation into the attack and the devastating effect it had on the small town and the families who lost loved ones.

The Bombing of Pan Am 103 premieres on BBC One and iPlayer on Sunday 18th May, with new episodes premiering at 9pm every Sunday and Monday for three weeks.

Check out more of our Drama coverage or visit our TV Guide and Streaming Guide to find out what's on. For more from the biggest stars in TV, listen to The Radio Times Podcast.
  `


  const response = await context.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
    stream: false,
    max_tokens: 512,
    messages: [
      { role: "user", content: `${prompt} ---- ${txt}` }
    ]
  })
  const obj = {
    ok: true,
    response
  }


  // send response
  return new Response(JSON.stringify(obj), okResponse)
}
