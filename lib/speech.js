function initSpeech() {
  speechRecognizer = new SpeechRecognizer()
  speechRecognizer.setKeywords(["cortana"])
  speechRecognizer.onresult = function(result) {
    throw result
    if (result.text === "cortana") {
      throw result
      filterDate = '2018-01-01'
    }
  }
}