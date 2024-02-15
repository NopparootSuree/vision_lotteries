const vision = require('@google-cloud/vision');
const checkReward = require('../utils/check_reward')

const reward = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    try {
        const base64 = req.file.buffer.toString('base64');
        const client = new vision.ImageAnnotatorClient({ keyFilename: './google-api-credentials.json' });
        const request = { image: { content: base64 } };
        const [result] = await client.textDetection(request);
        const description = result.textAnnotations[0].description;
        const lotteryNumber = description.match(/[0-9]{6}/);
        let response = await checkReward(lotteryNumber[0])
        res.json({ result: response });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Error processing image' });
    }
};

const number_reward = async (req, res) => {
    const { lottery_no } = req.body
    try {
        let response = await checkReward(lottery_no)
        res.json({ result: response });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Error processing image' });
    }
};

module.exports = {
    reward,
    number_reward
}