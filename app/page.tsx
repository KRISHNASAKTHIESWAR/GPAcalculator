"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

type Subject = {
  name: string;
  credits: number;
  grade: string;
};

export default function GPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([{ name: "", credits: 0, grade: "" }]);
  const [sgpa, setSGPA] = useState<number | null>(null);
  const [cgpa, setCGPA] = useState<number | null>(null);
  const [previousCGPA, setPreviousCGPA] = useState<number>(0);

  const gradePoints: { [key: string]: number } = {
    O: 10,
    "A+": 9,
    A: 8,
    "B+": 7,
    B: 6,
    C: 5,
    RE: 0,
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", credits: 0, grade: "" }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index: number, field: keyof Subject, value: string | number) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const calculateGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    subjects.forEach((subject) => {
      if (subject.credits > 0 && gradePoints[subject.grade] !== undefined) {
        totalGradePoints += subject.credits * gradePoints[subject.grade];
        totalCredits += subject.credits;
      }
    });

    const calculatedSGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    setSGPA(Number.parseFloat(calculatedSGPA.toFixed(2)));

    const calculatedCGPA = previousCGPA > 0 ? (calculatedSGPA + previousCGPA) / 2 : calculatedSGPA;
    setCGPA(Number.parseFloat(calculatedCGPA.toFixed(2)));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <Link href="https://cit-celestius.vercel.app/" target="_blank" className="text-blue-400 hover:text-blue-300">
              Celestius
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center space-x-2">
                {/* Subject Name Input */}
                <Input
                  placeholder="Subject Name"
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                  className="flex-grow bg-gray-700 text-white"
                />

                {/* Credits Input */}
                <Input
                  type="number"
                  placeholder="Credits"
                  min="0"
                  value={subject.credits || ""}
                  onChange={(e) => handleSubjectChange(index, "credits", Number(e.target.value) || 0)}
                  className="w-20 bg-gray-700 text-white"
                />

                {/* Grade Select Dropdown */}
                <Select 
                  value={subject.grade} 
                  onValueChange={(value) => handleSubjectChange(index, "grade", value)}
                >
                  <SelectTrigger className="w-24 bg-gray-700 text-white border border-gray-600">
                    <SelectValue>
                      {subject.grade || "Grade"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent 
                    className="bg-gray-700 text-white border border-gray-600 rounded-md"
                    side="bottom"
                    align="center"
                  >
                    {Object.keys(gradePoints).map((grade) => (
                      <SelectItem 
                        key={grade} 
                        value={grade}
                        className="hover:bg-gray-600 focus:bg-gray-600"
                      >
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Remove Button */}
                <Button variant="destructive" size="icon" onClick={() => removeSubject(index)} disabled={subjects.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add Subject Button */}
            <Button onClick={addSubject} className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </div>

          {/* Previous CGPA Input */}
          <div className="mt-4">
            <Label htmlFor="previousCGPA" className="text-white">
              Previous CGPA
            </Label>
            <Input
              id="previousCGPA"
              type="number"
              min="0"
              step="0.01"
              value={previousCGPA || ""}
              onChange={(e) => setPreviousCGPA(Number(e.target.value) || 0)}
              placeholder="Enter previous CGPA"
              className="bg-gray-700 text-white"
            />
          </div>

          {/* Calculate Button */}
          <Button onClick={calculateGPA} className="w-full mt-4 bg-green-600 hover:bg-green-700">
            Calculate GPA
          </Button>

          {/* Results Display */}
          {sgpa !== null && cgpa !== null && (
            <div className="mt-4 space-y-2 text-center">
              <p className="text-lg font-semibold">
                SGPA: <span className="text-blue-400">{sgpa}</span>
              </p>
              <p className="text-lg font-semibold">
                CGPA: <span className="text-blue-400">{cgpa}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
