const studentSchemaInfo = {
  title: "Student Upload",
  columns: [
    "name",
    "email",
    "password",
    "gender",
    "phoneNumber",
    "enrollmentNumber",
    "center",
    "department",
    "batch",
  ],
  sampleRow: [
    "Aarav Kumar",
    "aarav.kumar1@pwioi.com",
    "Pass@123",
    "Male",
    "9876543210",
    "PATSOT23B1001001",
    "Patna",
    "SOT",
    "SOT25B1",
  ],
  columnDescriptions: [
    { key: "name", description: "Full name of the student" },
    { key: "email", description: "Email address of the student" },
    { key: "password", description: "Password for student account" },
    { key: "gender", description: "Gender (Male, Female, Other)" },
    { key: "phoneNumber", description: "Phone number (10 digits)" },
    {
      key: "enrollmentNumber",
      description: "Unique enrollment number",
    },
    { key: "center", description: "Center name (e.g., Patna)" },
    { key: "department", description: "Department (SOT, SOM, SOH)" },
    { key: "batch", description: "Batch name (e.g., SOT24B1)" },
  ],
  guidelines: [
    "Column headers must match exactly",
    "All fields are required",
    "Department should be one of: SOT, SOM, SOH",
    "Center name must match existing centers",
    "Batch names must match existing batches",
  ],
  commonIssues: [
    "Wrong column names",
    "Missing required fields",
    "Incorrect department or center names",
    "Duplicate enrollment numbers",
    "Invalid email formats",
  ],
  downloadLink:
    "https://docs.google.com/spreadsheets/d/1mFMfCSvTwOAQQwB99M75PM5-7BWS8zz0XHTlv2SXo7U/export?format=xlsx",
};

export default studentSchemaInfo;
