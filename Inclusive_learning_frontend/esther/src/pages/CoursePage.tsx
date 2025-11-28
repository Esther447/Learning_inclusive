/**
 * Courses Page
 * Accessible & Inclusive Course Listing
 */

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";

// ❗ IMPORTANT: your component is a named export.
import { AccessibleButton } from "../components/AccessibleButton";

import { api } from "../services/api.ts";
import type { Course } from "../types";

export const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch all courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load courses.");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter + search results
  const filteredCourses = courses.filter((course) => {
    const matchesTab = filter === "all" || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📚 Available Courses
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search for a course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Tabs */}
      <Tabs
        value={filter}
        onChange={(_, value) => setFilter(value)}
        sx={{ mb: 3 }}
      >
        <Tab value="all" label="All Courses" />
        <Tab value="technology" label="Technology" />
        <Tab value="business" label="Business" />
        <Tab value="design" label="Design" />
        <Tab value="accessibility" label="Accessibility" />
      </Tabs>

      {/* Courses Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
        gap={3}
      >
        {filteredCourses.map((course) => (
          <Card key={course.id} sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {course.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 2 }}
              >
                {course.description}
              </Typography>

              <Chip
                icon={<SchoolIcon />}
                label={course.category}
                color="primary"
                size="small"
              />
            </CardContent>

            <CardActions>
              <AccessibleButton
                variant="contained"
                color="primary"
                fullWidth
                announceOnClick
                announcementText={`Opening course ${course.title}`}
                onClick={() => {
                  window.location.href = `/course/${course._id}`;
                }}
              >
                View Course
              </AccessibleButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};
