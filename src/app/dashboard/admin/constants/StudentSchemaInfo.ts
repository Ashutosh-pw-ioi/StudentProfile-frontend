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
    "John Doe",
    "john@example.com",
    "password123",
    "Male",
    "1234567890",
    "ENR2024001",
    "Patna",
    "SOT",
    "SOT24B1",
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
    "https://glqns72ea6.ufs.sh/f/35ZKzNsv5By61oPdNSQHWyStvbcNAs0uUq6hILf7wZlnmxj8",
};

export default studentSchemaInfo;
