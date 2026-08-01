export function pickBestChineseVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const preferredLangs = ["zh-CN", "zh-SG", "zh-TW", "zh-HK", "zh"];
  const preferredNamePatterns = [
    /mandarin/i,
    /putonghua/i,
    /xiaoxiao/i,
    /yunxi/i,
    /tingting/i,
    /hanhan/i,
    /mei-jia/i,
    /zh[-_]?cn/i,
    /zh[-_]?tw/i,
  ];

  const normalize = (value: string) => value.toLowerCase();

  for (const code of preferredLangs) {
    const exact = voices.find((voice) => normalize(voice.lang) === code.toLowerCase());
    if (exact) {
      return exact;
    }
  }

  const chineseVoices = voices.filter((voice) => normalize(voice.lang).startsWith("zh"));
  const namedPreferred = chineseVoices.find((voice) =>
    preferredNamePatterns.some((pattern) => pattern.test(voice.name)),
  );
  if (namedPreferred) {
    return namedPreferred;
  }

  return chineseVoices[0];
}
