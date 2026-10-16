# b4usend 

A browser extension that checks how your messages might come across before you send them!

## So what is b4usend?

Have you ever typed  a message and wondered if it sounds rude or too aggressive or like just not the way that you meant it?

So the solution to this is  b4usend

It's basically a browser extension that looks at the way a message is written and then tries to figure out its tone before you send it and  it checks things like politeness, friendliness, frustration, hostility, urgency, sarcasm, and a bunch of other communication signals(19 in total)



 everything runs locally in the browser and your messages aren't sent to an external API or some server for analysis cos privacy always comes first :)

## What can it do?

 Analyse your message while your typing
 Detect th different communication signals
 Look at the  context instead of just relying  on keywords
 Gives each analysis a confidence score
 Uses a fallback analyzer when it needs to 
 Run locally without needing an internet connection for the analysis and also keeps your texts private
 Works with Chrome and other Chromium based browsers tho

The signals it checks are   politeness, warmth, friendliness, hostility, frustration, irritation, pressure, urgency, blame, accusation, sarcasm, teasing, directness, formality, casualness, emotional intensity, ambiguity, positivity, and negativity

## Getting started

so youre gonna need node.js and npm installed.

first , you wanna clone the repository then open a terminal in the project folder, and then run:

```bash
npm install
npm run build
```

and when the build finishes:

 Open `chrome://extensions` in Chrome (or edge or any other chromium based browsewr) then enable developer mode and click on where it says **Load unpacked**  then select the folder you jus downloaded

That's it!!! :) You should now be able to use the extension!


## How does it actually work?

The main analyzers in `src/analyzer.js`.

I went with a rule-based approach because I wanted the extension to be pretty  lightweight and  fast and easy to work on instead of  depending on like an  external service

The analyzer looks at different parts of a message together like 

 **Context:** the words around a phrase can sometimes  change its meaning and context is just reallyh important 
 **Negation:** A message saying someone isn't angry shouldn't automatically be flagged as angry (this was an issue )
 **Sentence structure:** The way a sentence is phrased can sumtimes affect how it comes across to the reader 
**Hedging:** Words that make a statement feel wayy less certain or soften the way something is said
 **Punctuation:** Things like repeated exclamation marks and stuff can affect the perceived intensity of a message !!!!!!
 **Capitalization:** Excessive capital letters can also sometimes indicate emphasis
 **Conversational style:** A casual message and a formal message shouldn't necessarily be judged in the same way(obviously)



okay tbh it cant really understand every message perfectly yet but it should be able to tell how it feels without needing to understand (sounds wierd ik)

## The signals

so here's what the analyzerlooks at rn (the 19 signals i mentioned before ): 
politeness, warmth, friendliness, hostility, frustration, irritation, pressure, urgency, blame, accusation, sarcasm, teasing, directness, formality, casualness, emotional intensity, ambiguity, positivity, and negativity


so how it works is each signal gets a value between `0.0` and `1.0` and like 

 `0.0` means that the signal wasnt detected
 `0.5` means the signal is present to a   moderate degree
 `1.0` means the signal is  strong

The analyzer also gives a confidence score between `0.0` and `1.0`whcih  represents how reliable the overall analysis is expected to be



## Using the analyzer:

like i said , the main analyser is at  `src/analyzer.js`.

if you want to check it out seperately just open the html 

## Why not just use an ML model?

so tho at first i thought of using an ml model i then decided that for my first release i would use a rule based model coos its more private for the user , faster , and doesnt need internet 

i might add it in the next release like a lightweight local ml model and if it fails it has a fallback and uses somehthing like gemini thru its api

## Performance

The analyzer is designed to be fast enough to run while you're typing, without making the browser feel slow

The current  performance figures are (average numbers that ive observed) : initialization around a 100 ms , first analysis around 30 ms  subsequent analyses after that around 15–50 ms adn target memory usage is under 5 MB.

but these figures should be treated as benchmarks rather than guarantees btw cos actual performance depends on the device and browser

ages leaving your device for analysis.



b4usend isn't going to get every message right(for now), and that's something i wanna be clear about.

## limits
so for now its not gonna get everythign ryt cos it has so many things to work on like sarcasm , irony , techniacl terms , false posotives , and like some things may sound appropriate in some places but really wierd or rude in other places


## stuff that ill do next:

Theres a few things I'd like to explore with time like using a local ml model , letting the user decide how storngly different signals should be weighted , having a conversation history and finally adding multi lang support




## You can  check out the web pages for b4usend which are hosted on vercel

(https://b4usend-web.vercel.app/newuser.html) check it out here 




