import {WebClient} from '@slack/web-api'

export default async (slackBotToken: string, message: string, channelId: string): Promise<void> => {
    console.log(slackBotToken)
    const client = new WebClient(slackBotToken);
    try {
        const result = await client.chat.postMessage({
            token: slackBotToken,
            channel: channelId,
            text: message
        })
    } catch(err: any) {
        console.log(err)
    }
}