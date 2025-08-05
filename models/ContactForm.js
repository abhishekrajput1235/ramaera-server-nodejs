const mongoose = require("mongoose");


const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear().toString();
    return `${day}-${month}-${year}`;
};


const ContactSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        CreatedAt: {
            type: String, // Store as string in DD-MM-YYYY format
            default: function () {
                return formatDate(new Date()); // Use formatted current date
            },
        },
    }
)

const Contact = mongoose.model("ContactForm", ContactSchema);

module.exports = Contact;


