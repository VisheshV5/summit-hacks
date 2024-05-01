const db = require("../models");
const Course = db.course;
const axios = require("axios");
const { OpenAI } = require("openai");
const { YoutubeTranscript } = require("youtube-transcript");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const createQuiz = async (req, res) => {
  const { subject, num } = req.body;

  const format = {
    chapters: [
      {
        title: "chapter of title with max length of 15 words",
        topics: [
          { title: "topic of title with max length of 15 words" },
          { title: "topic of title with max length of 15 words" },
          { title: "topic of title with max length of 15 words" },
        ],
      },
    ],
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI that is able to generate courses with individual sub-topics on any subject, store all chapters and topics in a JSON array. \nYou are to output the following in json format: ${JSON.stringify(
            format
          )} \nDo not put quotation marks or escape character \\ in the output fields.`,
        },
        {
          role: "user",
          content: `Generate a course based on ${subject} with ${num} chapters, each chapter containing 1 topic based on the subject.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    let message =
      response.choices[0].message?.content?.replace(/'/g, '"') ?? "";
    message = message.replace(/(\w)"(\w)/g, "$1'$2");

    const startIndex = message.indexOf("[");
    const endIndex = message.lastIndexOf("]") + 1;

    const jsonArrayString = message.slice(startIndex, endIndex);
    const chaptersArray = JSON.parse(jsonArrayString);

    const course = new Course({
      title: `Generated Course - ${new Date().toLocaleString()}`,
      description: `Course generated for ${subject}`,
      subject: subject,
      // image: {
      //   public_id: photoUrl.public_id,
      //   url: photoUrl.secure_url,
      // },
      chapters: chaptersArray,
      user: req.params.userId,
    });

    await course.save();
    res.send({ message: course._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

const generateTopics = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    for (const chapter of course.chapters) {
      for (const topic of chapter.topics) {
        const videoUrl = await generateYouTubeVideo(topic.title);
        const transcript = await getTranscript(videoUrl);
        const question = await getQuestion(topic.title, topic.summary);

        if (topic.videoUrl && topic.summary && topic.question) {
          continue;
        }

        if (!topic.videoUrl) {
          topic.videoUrl = videoUrl;
        }

        if (!topic.summary) {
          const summary = await generateSummary(transcript);
          topic.summary = summary.summary;
        }

        if (!topic.question || !topic.question.question) {
          topic.question = question;
          console.log("im here");
        }
      }
    }

    await course.save();

    res.send({ message: "Topics generated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const generateYouTubeVideo = async (title) => {
  try {
    const searchQuery = encodeURIComponent(title);

    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
    );

    const videoId = data.items[0].id.videoId;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return videoUrl;
  } catch (error) {
    console.error(
      "Error generating YouTube video:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const generateSummary = async (transcript) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are an AI capable of summarising a youtube transcript, store the summary in a JSON object. \nYou are to output the following in json format: ${JSON.stringify(
            {
              summary: "summary of the transcript",
            }
          )} \nDo not put quotation marks or escape character \\ in the output fields.`,
        },
        {
          role: "user",
          content:
            "summarize in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" +
            transcript,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    let message = response.choices[0].message?.content;
    console.log(message);

    const startIndex = message.indexOf("{");
    const endIndex = message.lastIndexOf("}") + 1;

    const jsonObjectString = message.slice(startIndex, endIndex);
    const summary = JSON.parse(jsonObjectString);

    return summary;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getQuestion = async (title, transcript) => {
  const format = {
    question: "question",
    answer: "answer with max length of 15 words",
    options: [
      "option1 with max length of 15 words",
      "option2 with max length of 15 words",
      "option3 with max length of 15 words",
      "option4 with max length of 15 words",
    ],
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON object. \nYou are to output the following in json format: ${JSON.stringify(
            format
          )} \nDo not put quotation marks or escape character \\ in the output fields.`,
        },
        {
          role: "user",
          content: `You are to generate a random mcq question about ${title} with context of this transcript: ${transcript}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    let message = response.choices[0].message?.content;
    console.log(message);

    const startIndex = message.indexOf("{");
    const endIndex = message.lastIndexOf("}") + 1;

    const jsonObjectString = message.slice(startIndex, endIndex);
    const question = JSON.parse(jsonObjectString);

    return question;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function getTranscript(videoId) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
      country: "EN",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }
    return transcript.replaceAll("\n", "");
  } catch (error) {
    return "";
  }
}

module.exports = { createQuiz, generateTopics, getQuestion };
