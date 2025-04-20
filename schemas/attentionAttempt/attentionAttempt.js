import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  studentID: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Change: ref:"studentSchema"
  triggerTime: { type: Date, required: true },
  responseTime: { type: Date, required: true },
  response: { type: String, enum: ['Yes', 'No', 'Maybe', 'Not Answered'], required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Skipped'], required: true },
  question: { type: String, required: true },
  attentionItemID: { type: mongoose.Schema.Types.ObjectId, auto: true } // Change: May or Maynot be.
});

const Response = mongoose.model('Response', ResponseSchema);

export default Response;

// JSON Example: 

// {
//     "studentID": "650c14c9f1a2b4a8e2d1e1a3",
//     "triggerTime": "2024-03-03T10:00:00Z",
//     "responseTime": "2024-03-03T10:00:05Z",
//     "response": "Yes",
//     "status": "Completed",
//     "question": "Did you understand the topic?",
//     "attentionItemID": "650c14c9f1a2b4a8e2d1e1b4"
// }
  
