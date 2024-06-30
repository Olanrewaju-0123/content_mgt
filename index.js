require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});

const users = [];
const articles = [];
const categories = [];

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to my site",
  });
});

// USER REGISTRATION
app.post("/register", (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  try {
    if (!firstName || !lastName || !email || !phoneNumber)
      throw new Error("All details are required");
    if (isNaN(phoneNumber)) throw new Error("Phone Number must be a number");
    const existingUser = users.find(
      (user) => user.email === email || user.phoneNumber === phoneNumber
    );
    if (existingUser)
      throw new Error("User with this email or phone number already exists");
    const newUser = {
      id: users.length + 1,
      firstName,
      lastName,
      email,
      phoneNumber,
    };
    users.push(newUser);
    res.status(200).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// RETRIEVE USER PROFILE INFORMATION
app.get("/user/:id", (req, res) => {
  try {
    const { id } = parseInt(req.params.id);
    const findUser = users.find((user) => user.id === id);
    if (!findUser) throw new Error("User not found");
    res.status(200).json({
      status: "success",
      message: "User Profile Retrieved",
      user: findUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// UPDATE USER PROFILE INFORMATION
app.patch("/user/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { firstName, lastName, email, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber)
      throw new Error("All fields are required");
    const filterUser = users.filter((user) => user.id === id);
    if (!filterUser)
      throw (
        (new Error("User not found")((filterUser[0].firstName = firstName)),
        (filterUser[0].lastName = lastName),
        (filterUser[0].email = email),
        (filterUser[0].phoneNumber = phoneNumber),
        res.status(200).json({
          status: "success",
          message: "User Profile Updated",
        }))
      );
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// DELETE USER ACCOUNT
app.delete("/user/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const findId = users.findIndex((user) => user.id === id);
    if (findId === -1) throw new Error("User not found");
    users.splice(findId, 1);
    res.status(200).json({
      status: "success",
      message: "User account Deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// CREATE A NEW ARTICLE
app.post("/article", (req, res) => {
  try {
    const { title, body, footer } = req.body;
    if (!title || !body || !footer) throw new Error("All details are required");
    const existingArticle = articles.find(
      (article) =>
        article.title === title &&
        article.body === body &&
        article.footer === footer
    );
    if (existingArticle) throw new Error("Articles already existed");

    const newArticle = {
      id: articles.length + 1,
      title,
      body,
      footer,
    };
    articles.push(newArticle);

    res.status(200).json({
      status: "success",
      message: "Article created successfully",
      article: newArticle,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
});

// RETRIEVE A LIST OF ALL ARTICLES
app.get("/articles", (req, res) => {
  try {
    if (articles.length === 0) throw new Error("No Articles found");

    res.status(200).json({
      status: "success",
      message: "Articles retrieved successfully",
      articles: articles,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// RETRIEVE A SPECIFIC ARTICLES BY ID
app.get("/article/:id", (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    if (isNaN(articleId)) throw new Error("Invalid article ID");
    const findArticle = articles.find((article) => article.id === articleId);
    if (!findArticle) throw new Error("Article not found");
    res.status(200).json({
      status: "success",
      message: `Articles retrieved successfully`,
      article: findArticle,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// UPDATE AN EXISTING ARTICLE
app.patch("/article/:id", (req, res) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      throw new Error("All fields are required");
    }

    const articleIndex = articles.findIndex(
      (article) => article.id === articleId
    );
    if (articleIndex === -1) {
      throw new Error("Article not found");
    }

    articles[articleIndex].title = title;
    articles[articleIndex].content = content;
    articles[articleIndex].author = author;

    res.status(200).json({
      status: "success",
      message: "Article updated successfully",
      article: articles[articleIndex],
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// DELETE AN ARTICLE
app.delete("/article/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const findId = articles.findIndex((article) => article.id === id);
    if (findId === -1) throw new Error("Article not found");
    articles.splice(findId, 1);
    res.status(200).json({
      status: "success",
      message: `Articles Deleted`,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
});

// CREATE A NEW CATEGORY
app.post("/category", (req, res) => {
  try {
    const { topics, author, year } = req.body;
    if (!topics || !author || !year)
      throw new Error("All details are required");
    const existingCategory = categories.find(
      (category) =>
        category.topics === topics &&
        category.author === author &&
        category.year === year
    );
    if (existingCategory) throw new Error("Category already exists");

    const newCategory = {
      id: categories.length + 1,
      topics,
      author,
      year,
    };

    categories.push(newCategory);

    res.status(200).json({
      status: "success",
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
});

// RETRIEVE A LIST OF ALL CATEGORIES
app.get("/categories", (req, res) => {
  try {
    if (categories.length === 0) throw new Error("No Category found");

    res.status(200).json({
      status: "success",
      message: `All Category retrieved`,
      categories: categories,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
});

// RETRIEVE ARTICLES BELONGING TO A SPECIFIC CATEGORY
app.get("/article/:id", (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Finding articles with the specified category ID
    const articlesByCategory = articles.filter(
      (article) => article.categoryId === categoryId
    );
    if (articlesByCategory.length === 0) {
      throw new Error("No articles found for the specified category");
    }

    res.status(200).json({
      status: "success",
      message: "Articles displayed",
      articles: articlesByCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// UPDATE A CATEGORY
app.patch("/category/:id", (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { topic, author, year } = req.body;

    if (!topic || !author || !year) {
      throw new Error("All fields are required");
    }

    const categoryIndex = categories.findIndex(
      (category) => category.id === categoryId
    );
    if (categoryIndex === -1) {
      throw new Error("category not found");
    }

    categories[categoryIndex].title = title;
    categories[categoryIndex].content = content;
    categories[categoryIndex].author = author;

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      category: categories[categoryIndex],
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

// DELETE A CATEGORY
app.delete("/category", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const findId = categories.findIndex((category) => category.id === id);
    if (findId === -1) throw new Error("category not found");
    categories.splice(findId, 1);
    res.status(200).json({
      status: "success",
      message: `category deleted`,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});
