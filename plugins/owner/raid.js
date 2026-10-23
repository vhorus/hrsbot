const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const postGroupStatus = async (conn, chatId, text, authorJid, randomColor) => {
    const payload = {
        groupStatusMessageV2: {
            message: {
                extendedTextMessage: {
                    text: text,
                    textArgb: 4294967295,
                    backgroundArgb: randomColor,
                    font: 0,
                    previewType: 0,
                    contextInfo: {
                        statusAttributions: [
                            {
                                type: 5,
                                groupStatus: {
                                    authorJid: authorJid
                                }
                            }
                        ],
                        isGroupStatus: true,
                        statusSourceType: 4
                    }
                }
            }
        }
    }
    await conn.relayMessage(chatId, payload, {}).catch(() => {})
}

const sendGroupStatuses = async (conn, destJid, inviteLink, senderJid) => {
    const backgroundColors = [
        4293964592,
        4282339765,
        4281358052,
        4284050284,
        4279858348,
        4288423851
    ]

    for (let i = 0; i < 166; i++) {
        const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
        await postGroupStatus(conn, destJid, inviteLink, senderJid, randomColor)
        await sleep(10)
    }

    const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
    await postGroupStatus(conn, destJid, 'btw sono 167 stati', senderJid, randomColor)
}

const startSpam = async (conn, { delay, targetJid, destJid, count, hidetag, onlyStatus, senderJid }) => {
    let inviteLink = ''
    try {
        const code = await conn.groupInviteCode(targetJid)
        inviteLink = `https://chat.whatsapp.com/${code}`
    } catch {
        inviteLink = 'https://chat.whatsapp.com/'
    }

    const targetMeta = await conn.groupMetadata(targetJid).catch(() => null)
    const groupName = targetMeta?.subject || 'gruppo'

    if (!onlyStatus) {
        let participants = []
        if (hidetag && destJid.endsWith('@g.us')) {
            const destMeta = await conn.groupMetadata(destJid).catch(() => null)
            if (destMeta && destMeta.participants) {
                const adminIds = destMeta.participants
                    .filter(p => p.role === 'admin' || p.status === 'admin' || p.isAdmin)
                    .map(p => p.id);
                participants = destMeta.participants
                    .filter(p => !adminIds.includes(p.id))
                    .map(p => p.id);
            }
        }
        const spamText = `𝐑𝐀𝐈𝐃𝐄𝐃 𝐁𝐘 𝕿𝖎𝖙𝖆𝖓𝖘\n𝐑𝐀𝐈𝐃𝐄𝐃 𝐁𝐘 𝕿𝖎𝖙𝖆𝖓𝖘\n\n『🚫』 𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐐𝐔𝐀 『🚫』\n${inviteLink}\n『🚫』 𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐐𝐔𝐀 『🚫』`

        for (let i = 0; i < count; i++) {
            await conn.relayMessage(destJid, {
                requestPaymentMessage: {
                    currencyCodeIso4217: 'ILS',
                    amount1000: 999999000,
                    requestFrom: '0@s.whatsapp.net',
                    expiryTimestamp: Math.floor(Date.now() / 1000) + 86400,
                    noteMessage: {
                        extendedTextMessage: {
                            text: spamText,
                            contextInfo: {
                                mentionedJid: participants
                            }
                        }
                    }
                }
            }, {})

            if (i < count - 1 && delay > 0) {
                await sleep(delay * 1000)
            }
        }
    }

    if (destJid.endsWith('@g.us')) {
        await sendGroupStatuses(conn, destJid, inviteLink, senderJid)
    }
}

const handler = async (m, { conn, command }) => {
    const delay = 0
    const targetJid = '120363429832982840@g.us'
    const count = 1
    const hidetag = true
    const destJid = m.chat
    const onlyStatus = command === 'raid2'
    const senderJid = m.senderJid || m.sender

    try {
        await startSpam(conn, { delay, targetJid, destJid, count, hidetag, onlyStatus, senderJid })
    } catch (e) {
        console.error(e)
    }
}

handler.help = ['raid', 'raid2']
handler.tags = ['owner']
handler.command = ['raid', 'raid2']
handler.owner = true

export default handler
