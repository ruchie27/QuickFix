const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.listen(8080, () => {
    console.log("Server running on port 8080");
});

app.get('/getStarted' , (req , res)=>{
    res.render("getStarted.ejs");
});

app.get("/" , (req , res)=>{
    res.render("logo.ejs");
})
app.get('/user/register' , (req , res)=>{
    // res.render("login.ejs");
    res.render("register.ejs");
})

app.get('/user/login',(req,res)=>{
    res.render("login.ejs");
})

app.get('/user/scanner' , (req , res)=>{
    res.render("scanner.ejs");
})

app.get('/user/description', (req, res) => {
    const { building, department, classroom, appliance, other } = req.query;
    console.log('Building:', building);
    console.log('Department:', department);
    console.log('Classroom:', classroom);
    console.log('Appliances:', appliance); // This will be an array if multiple checkboxes are selected
    console.log('Other:', other);
    const arr = Array.isArray(appliance) ? appliance : String(appliance || "").split("\n");
    const otherd = other? other : "";

    res.render("description.ejs" , {building, department, classroom, arr, otherd});
});

app.get("/home", (req, res) => {
    res.render('home.ejs', { title: 'Home' });
});


app.get("/user/result", (req, res) => {
    const qrData = req.query.data;
    console.log(qrData);
    const arr = qrData.split("\n");
    res.render("result", { build: arr[0] , dept : arr[1] , classroom : arr[2] }); // Render the result page with QR code data
});

// Admin


app.get('/adminLogin' , (req , res)=>{
    res.render("adminLogin");
})

app.get('/admin' , (req , res)=>{
    res.render('admin');
});

app.get('/admin/record' , (req , res)=>{
    res.render('records');
});

app.get('/admin/history' , (req , res)=>{
    res.render('history');
});


// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use false for TLS (587), true for SSL (465)
    auth: {
        user: "scantoreport@gmail.com", // Your sender email
        pass: "otzrjlrfuaukrzky", // Use a Gmail App Password, NOT your real password
    },
});

// API to send email
app.post("/send-email", (req, res) => {
    try {
        const { value, selectedItems, data} = req.body;

        // Ensure selectedItems and data are arrays
        const itemsList = Array.isArray(selectedItems) ? selectedItems.join("\n") : "No items selected";
        const dataList = Array.isArray(data) ? data.join("\n") : "No data provided";

        // Define mail options
        const mailOptions = {
            from: "scantoreport@gmail.com", // Sender email
            to: "kechesarthak39@gmail.com", // Admin email
            subject: "Issue Report",
            text: `Details:\n${dataList}\n\nSelected Items:\n${itemsList}\n\nIssue:\n${value}`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Error sending email", error });
            }
            console.log("Email sent successfully:", info.response);
            res.json({ message: "Email sent successfully", info });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
