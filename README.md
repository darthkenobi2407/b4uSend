# b4usend — Message Analyzer Extension

Its a browser extension that checks how your messages might come across before you send them.

## What is b4usend?

Have you ver typed out a message and wondered if it sounds rude, too aggressive, or like just not the way that you meant it?

So that's why I made b4usend

It's basically a browser extension that looks at the way a message is written and then tries to figure out its tone before you send it and  it checks things like politeness, friendliness, frustration, hostility, urgency, sarcasm, and a bunch of other communication signals.

so the main thing I wanted to avoid was making something that just looks for certain words and immediatelyjust labels a message based on them because  like context matters, and the same sentence can come across completely differently depending on how it's used.

Also like , everything runs locally in the browser and your messages aren't sent to an external API or some server for analysis cos privacy always comes first :)

## What can it do?

* Analyze messages when you're typing
* Detect around different communication signals
* Look at context instead of relying entirely on keywords
* Give each analysis a confidence score
* Use a fallback analyzer when needed
* Work with text inputs, textareas, and content-editable elements
* Run locally without needing an internet connection for the analysis itself
* Work with Chrome and other Chromium-based browsers

The signals it checks include  politeness, warmth, friendliness, hostility, frustration, irritation, pressure, urgency, blame, accusation, sarcasm, teasing, directness, formality, casualness, emotional intensity, ambiguity, positivity, and negativity.

## Getting started

so ou'll need node.js and npm installed.

Clone the repository then open a terminal in the project folder, and run:

```bash
npm install
npm run build
```

when the build finishes:

1. Open `chrome://extensions` in Chrome.
2. Enable Developer mode.
3. click **Load unpacked**.
4. Select the `dist` folder created by the build.

That's it!!! :) You should now be able to use the extension!

if you wanna make changes to the source code, you can run `npm run build` again to rebuild it.

## How does it actually work?

The main analyzer is in `src/analyzer.js`.

I went with a rule-based approach because I wanted the extension to be pretty  lightweight and  fast and easy to work on instead of  depending on an external service.

but like it's not meant to be a basic keyword detector.

The analyzer looks at different parts of a message together like 

* **Context:** The words around a phrase can change its meaning
* **Negation:** A message saying someone isn't angry shouldn't automatically be flagged as angry
* **Sentence structure:** The way a sentence is phrased can affect how it comes acros
* **Hedging:** Words that make a statement less certain or soften the way something is said
* **Punctuation:** Things like repeated exclamation marks can affect the perceived intensity of a message
* **Capitalization:** Excessive capital letters can sometimes indicate emphasis
* **Conversational style:** A casual message and a formal message shouldn't necessarily be judged in the same way

All of  these things contribute to the analysis. One word on its own shouldn't be enough to decide exactly what a person means.

like for example, being direct doesn't automatically mean being rude right? Similarly, a message containing an angry-sounding word isn't necessarily hostile.

The goal is basically to make the analysis more useful without pretending it can understand every message perfectly.

## The signals

so here's what the analyzer currently looks at:

| Signal              | What it means                                             |
| ------------------- | --------------------------------------------------------- |
| Politeness          | How polite or courteous the message sounds                |
| Warmth              | How caring or considerate it comes across                 |
| Friendliness        | How friendly and approachable it sounds                   |
| Hostility           | Whether it comes across as aggressive or antagonistic     |
| Frustration         | Signs of impatience or dissatisfaction                    |
| Irritation          | Whether the message sounds annoyed                        |
| Pressure            | Whether the message pushes someone to do something        |
| Urgency             | Whether something sounds time-sensitive                   |
| Blame               | Whether responsibility for something is being assigned    |
| Accusation          | Whether someone is being accused of doing something wrong |
| Sarcasm             | Whether the message might have a sarcastic meaning        |
| Teasing             | Whether someone is being playfully teased                 |
| Directness          | How directly the message gets its point across            |
| Formality           | How formal the language is                                |
| Casualness          | How informal the language is                              |
| Emotional intensity | How strongly emotions are expressed                       |
| Ambiguity           | How unclear or uncertain the message is                   |
| Positivity          | How positive the message comes across                     |
| Negativity          | How negative the message comes across                     |

Each signal gets a value between `0.0` and `1.0`.

* `0.0` means that the signal wasn't detected.
* `0.5` means the signal is present to a   moderate degree.
* `1.0` means the signal is  strong.

The analyzer also gives a confidence score between `0.0` and `1.0`whcih  represents how reliable the overall analysis is expected to be.

These values aren't suppoesd to be absolute judgments about what a person  intended , they're estimates based on the message itself.

## Using the analyzer

The main analyzer is available in `src/analyzer.js`.

for example:

```javascript
import { analyzeMessage } from './src/analyzer.js';

const result = analyzeMessage(
  'Can you send me the report?'
);

console.log(result);
```

The extension can also expose the analyzer globally when loaded in the appropriate extension context:

```javascript
window.b4usendAnalyzer.analyzeMessage(
  'Can you send me the report?'
);
```

The result contains the detected signals and the confidence score.

also make sure the import and function names match the exports in your current version of `src/analyzer.js`.

## Why not just use an ML model?

I did actuallt consider using a small machine learning model at first but I wanted to start with something that was fast, lightweight, and didn't need to download a model or send anything over the internet.

Using rules also makes it easier to understand why a signal was triggered and change the logic when something doesn't rly work as expected.

The main reasons for going with this approach were:

* **Privacy:** Messages stay on the device. (most important)
* **Speed:** Analysis doesn't depend on network requests.
* **Control:** The rules can be adjusted as the project improves.
* **Debugging:** It's easier to figure out why a particular result was produced.
* **Offline support:** The analyzer doesn't need an internet connection.

i know a rule-based system has its limits but the point isn't that this approach is perfect ,it's that it makes sense for a lightweight browser extension where privacy and speed are most important.

## Performance

The analyzer is designed to be fast enough to run while you're typing, without making the browser feel slow

The current reported performance figures are:

* Initialization: around a 100 ms.
* First analysis: around 30 ms.
* Subsequent analyses: around 15–50 ms.
* Typing debounce: 500 ms.
* Target memory usage: under 5 MB.

but these figures should be treated as benchmarks rather than guarantees cos actual performance depends on the device and browser.

## Privacy

This is one of the main things I wanted to get right.

b4usend is designed to analyze messages locally, without sending their contents to an external service.

* No external API calls for message analysis.
* No sending message content to a remote server.
* No built-in analytics or tracking.
* No internet connection required for the core analysis.

The extension is intended to work without your messages leaving your device for analysis.

## Testing

To run the tests, use:

```bash
npm test
```

the test suite covers basic functionality, contextual understanding, edge cases, relationships between signals, and performance.

The existing test report indicates that the requirements tests, contextual tests, signal relationship checks, and performance benchmarks passed , uou can run the suite yourself to verify the results against the current code.

## Limitations

b4usend isn't going to get every message right(for now), and that's something i wanna be clear about.

A lot of communication depends on things that aren't present in a single message.

For example:

* **Sarcasm:** It's often  difficult for a rule based algo to tell whether someone is being serious without knowing the conversation.
* **Cultural differences:** The same phrase can mean different things to different peoplein different places
* **Short messages:** Something like "okay" doesn't rly give the analyzer much to work with
* **Irony:** It's not always easy to distinguish irony from sarcasm
* **Technical language:** Unusual wording or like industry-specific terms can affect the results too
* **False positives:** Some messages will inevitably be interpreted incorrectly

That's why the analyzer uses confidence scores and tries to be conservative when the context isn't clear.

It's there to give you another perspective on a message, not to tell you exactly what someone thinks or how they're going to react.

## so what's next?

Theresa few things I'd like to explore as this project develops:

* Trying to use  a small local ML model to improve contextual understanding
* Letting the users adjust how strongly different signals are weighted
* Adding a conversation history so earlier messages can provide more context
* Tuning the analyzer for different situations, such as professional emails and casual conversations
* Adding support for more languages

these are some cool ideas i wanna try out later

## Try it out!!!!

You can also check out the web pages for b4usend which are hosted on vercel

* **[Popup](https://b4usend-web.vercel.app/popup.html)** — Open the popup interface which is essentially the analyzer in a html form 
* **[Options](https://b4usend-web.vercel.app/options.html)** — Open the options page which lets you toggle around with settings

## Finally

The idea behind b4usend is pretty simple: sometimes it's not just about what you say, but how you say it.

I wanted to build something that could help pick up on that without making the whole process complicated or slowing things down or compromising privacy

It's still something that can be improved definietly  but this is the approach I'm taking with it for now

**Built with JavaScript, contextual rules, and a focus on privacy.**
