import Groq from "groq-sdk";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import FormData from "form-data";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParser = require("pdf-parse/lib/pdf-parse.js");

// ✅ Initialize GROQ client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 Helper function for chat completion
async function chat(prompt, max_tokens = 400) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // BEST Groq model
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens,
  });

  return response.choices[0].message.content;
}

/* ==========================================================
   1️⃣ GENERATE ARTICLE
   ========================================================== */
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const content = await chat(prompt, length);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ==========================================================
   2️⃣ GENERATE BLOG TITLE
   ========================================================== */
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const content = await chat(prompt, 100);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ==========================================================
   3️⃣ IMAGE GENERATION (ClipDrop)
   ========================================================== */
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const form = new FormData();
    form.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      form,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...form.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      response.data
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ==========================================================
   4️⃣ REMOVE BACKGROUND
   ========================================================== */
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "Premium feature only",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ==========================================================
   5️⃣ REMOVE OBJECT
   ========================================================== */
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "Premium feature only",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object}`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ==========================================================
   6️⃣ RESUME REVIEW
   ========================================================== */
export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "Premium feature only",
      });
    }

    if (!resume)
      return res.json({ success: false, message: "No file uploaded" });

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdfParser(dataBuffer);

    const prompt = `
      Review this resume and provide detailed feedback:
      ${pdfData.text}
    `;

    const content = await chat(prompt, 1000);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'resume-review')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
