export function fakeQuote(text, name = 'Gestione') {
  return {
    key: {
      participant: '1807055946647697@bot',
      fromMe: false,
      id: 'FAKE' + Date.now(),
      remoteJid: 'status@broadcast',
    },
    message: {
      conversation: text,
    },
    pushName: name,
  };
}
