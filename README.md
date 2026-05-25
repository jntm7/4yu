# 4Yu

4Yu is a daily Chinese idiom (chengyu) explorer. Each day features a new idiom with pinyin, definition, origin, and example usage. Supports English, Simplified Chinese, and Traditional Chinese, with built-in pronunciation and copy-to-clipboard.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Lucide React

## Known Issues

### Speech Synthesis

Due to the limitations of Web Speech API, the pronunciation of certain Chinese chracters, most notably polyphonic characters, may be incorrect because it defaults to the most common reading, rather than using the pinyin from our dataset. 

SpeechSysnthesisUtterance takes the raw Chinese characters and the browser voice engine guesses the pronunciation, which leads to small inaccuracies as there's no way to hint the context. 

Each browser also embeds their own speech synthesis engine, so the subset of voices may differ depending on platform or OS.
