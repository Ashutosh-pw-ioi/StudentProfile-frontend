import { Calendar, FolderOpen, Users } from "lucide-react";
import { CategoryData } from "../acads/utitls/utils";

const categoryData: Record<string, CategoryData> = {
  "Fortnightly Tests": {
    icon: Calendar,
    color: "blue",
    data: [
      { name: "Test 1 - Fundamentals", score: 18, total: 20, percentage: 90 },
      {
        name: "Test 2 - Advanced Topics",
        score: 16,
        total: 20,
        percentage: 80,
      },
      {
        name: "Test 3 - Practical Applications",
        score: 19,
        total: 20,
        percentage: 95,
      },
      {
        name: "Test 4 - Comprehensive Review",
        score: 17,
        total: 20,
        percentage: 85,
      },
    ],
  },
  Projects: {
    icon: FolderOpen,
    color: "green",
    data: [
      {
        name: "Mini Project - Data Visualization",
        score: 47,
        total: 50,
        percentage: 94,
      },
      {
        name: "Group Project - ML Implementation",
        score: 45,
        total: 50,
        percentage: 90,
      },
      {
        name: "Final Project - Complete Solution",
        score: 48,
        total: 50,
        percentage: 96,
      },
      {
        name: "Research Project - Innovation",
        score: 46,
        total: 50,
        percentage: 92,
      },
    ],
  },
  Interviews: {
    icon: Users,
    color: "purple",
    data: [
      {
        name: "Technical Interview - Round 1",
        score: 28,
        total: 30,
        percentage: 93,
      },
      {
        name: "Technical Interview - Round 2",
        score: 26,
        total: 30,
        percentage: 87,
      },
      { name: "Behavioral Interview", score: 29, total: 30, percentage: 97 },
      {
        name: "Final Assessment Interview",
        score: 27,
        total: 30,
        percentage: 90,
      },
    ],
  },
};

export default categoryData;
