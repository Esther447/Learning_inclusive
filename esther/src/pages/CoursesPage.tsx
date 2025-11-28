/**
 * Courses Page Component
 * Display and manage courses
 */

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search as SearchIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useCourseStore } from "../store/courseStore";
import { useAuthStore } from "../store/authStore";
import { CourseCategory } from "../types";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import {AccessibleButton} from "../components/AccessibleButton.tsx";


export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, enrolledCourses, isLoading, error, fetchCourses, enrollInCourse } = useCourseStore();
  const { isAuthenticated, fetchCurrentUser } = useAuthStore();
  const { speak } = useTextToSpeech();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "general", difficulty: "beginner" });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCourses();
    fetchCurrentUser().then((u) => setCurrentUser(u));
  }, [fetchCourses, fetchCurrentUser]);

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) {
      speak("Please login to enroll in courses");
      navigate("/login");
      return;
    }

    try {
      await enrollInCourse(courseId);
      speak("Successfully enrolled in course");
    } catch (err) {
      speak("Failed to enroll in course");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: "All Courses",
      [CourseCategory.TECHNOLOGY]: "Technology",
      [CourseCategory.VOCATIONAL]: "Vocational",
      [CourseCategory.SOFT_SKILLS]: "Soft Skills",
      [CourseCategory.LITERACY]: "Literacy",
    };
    return labels[category] || category;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "error";
      default:
        return "default";
    }
  };

  const userRole = currentUser?.role;

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/courses", {
        title: form.title,
        description: form.description,
        category: form.category,
        difficulty: form.difficulty,
      });
      setShowCreate(false);
      setForm({ title: "", description: "", category: "general", difficulty: "beginner" });
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Loading courses...
        </Typography>
      </Container>
    );
  }

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Box sx={{marginBottom: 4}}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                        color: "#1a1a1a",
                    }}
                >
                    Available Courses
                </Typography>
                <Typography variant="body1" sx={{color: "#666", marginBottom: 3}}>
                    Explore our inclusive learning courses designed for everyone
                </Typography>

                {/* Search and Filter */}
                <Box sx={{display: "flex", gap: 2, marginBottom: 4, flexWrap: "wrap"}}>
                    <TextField
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{flex: 1, minWidth: "200px"}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tabs
                        value={selectedCategory}
                        onChange={(_, newValue) => setSelectedCategory(newValue)}
                        sx={{minHeight: "auto"}}
                    >
                        <Tab label="All" value="all"/>
                        <Tab label="Technology" value={CourseCategory.TECHNOLOGY}/>
                        <Tab label="Vocational" value={CourseCategory.VOCATIONAL}/>
                        <Tab label="Soft Skills" value={CourseCategory.SOFT_SKILLS}/>
                        <Tab label="Literacy" value={CourseCategory.LITERACY}/>
                    </Tabs>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{marginBottom: 3}}>
                    {error}
                </Alert>
            )}

            {filteredCourses.length === 0 ? (
                <Box sx={{textAlign: "center", py: 8}}>
                    <SchoolIcon sx={{fontSize: 64, color: "#ccc", marginBottom: 2}}/>
                    <Typography variant="h5" sx={{color: "#666", marginBottom: 1}}>
                        No courses found
                    </Typography>
                    <Typography variant="body1" sx={{color: "#999"}}>
                        Try adjusting your search or filter criteria
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 3,
                    }}
                >
                    {filteredCourses.map((course) => {
                        const isEnrolled = enrolledCourses.includes(course.id);
                        return (
                            <Card
                                key={course.id}
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        boxShadow: 6,
                                        transform: "translateY(-4px)",
                                    },
                                }}
                            >
                                <CardContent sx={{flex: 1}}>
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "start",
                                        marginBottom: 2
                                    }}>
                                        <Chip
                                            label={getCategoryLabel(course.category)}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={course.difficulty}
                                            size="small"
                                            color={getDifficultyColor(course.difficulty) as any}
                                        />
                                    </Box>

                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            fontWeight: 600,
                                            marginBottom: 1,
                                            color: "#1a1a1a",
                                        }}
                                    >
                                        {course.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#666",
                                            marginBottom: 2,
                                            minHeight: "60px",
                                        }}
                                    >
                                        {course.description}
                                    </Typography>

                                    <Box sx={{display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 2}}>
                                        <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                            <AccessTimeIcon sx={{fontSize: 18, color: "#666"}}/>
                                            <Typography variant="body2" sx={{color: "#666"}}>
                                                {course.duration} hours
                                            </Typography>
                                        </Box>
                                        <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                            <SchoolIcon sx={{fontSize: 18, color: "#666"}}/>
                                            <Typography variant="body2" sx={{color: "#666"}}>
                                                {course.modules.length} modules
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5, marginTop: 2}}>
                                        {course.accessibilityFeatures.slice(0, 3).map((feature) => (
                                            <Chip
                                                key={feature}
                                                label={feature.replace("-", " ")}
                                                size="small"
                                                variant="outlined"
                                                sx={{fontSize: "0.7rem"}}
                                            />
                                        ))}
                                        {course.accessibilityFeatures.length > 3 && (
                                            <Chip
                                                label={`+${course.accessibilityFeatures.length - 3} more`}
                                                size="small"
                                                variant="outlined"
                                                sx={{fontSize: "0.7rem"}}
                                            />
                                        )}
                                    </Box>
                                </CardContent>

                                <CardActions sx={{padding: 2, paddingTop: 0}}>
                                    {isEnrolled ? (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<CheckCircleIcon/>}
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                            sx={{textTransform: "none"}}
                                        >
                                            Continue Learning
                                        </Button>
                                    ) : (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => handleEnroll(course.id)}
                                            disabled={!isAuthenticated}
                                            sx={{textTransform: "none"}}
                                        >
                                            {isAuthenticated ? "Enroll Now" : "Login to Enroll"}
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        );
                    })}
                </Box>
            )}

            <Box sx={{marginTop: 4}}>
                {userRole === "mentor" || userRole === "administrator" ? (
                    <AccessibleButton onClick={() => setShowCreate(true)}>Add Course</AccessibleButton>
                ) : null}

                {showCreate && (
                    <form onSubmit={createCourse} aria-label="Create course form">
                        <label>
                            Title
                            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                                   required/>
                        </label>
                        <label>
                            Description
                            <textarea value={form.description}
                                      onChange={(e) => setForm({...form, description: e.target.value})}/>
                        </label>
                        <label>
                            Category
                            <select value={form.category}
                                    onChange={(e) => setForm({...form, category: e.target.value})}>
                                <option value="general">General</option>
                                <option value="accessibility">Accessibility</option>
                            </select>
                        </label>
                        <label>
                            Difficulty
                            <select value={form.difficulty}
                                    onChange={(e) => setForm({...form, difficulty: e.target.value})}>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </label>
                        <AccessibleButton type="submit">Create</AccessibleButton>
                        <AccessibleButton type="button" onClick={() => setShowCreate(false)}>Cancel</AccessibleButton>
                    </form>
                )}
            </Box>
        </Container>
    );
};

