import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Box, Container, Typography, Grid, Card, CardContent, Button, Stack, TextField, Alert, Divider } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useTheme } from "@mui/material/styles"
import ShieldIcon from "@mui/icons-material/Shield"
import PeopleIcon from "@mui/icons-material/People"
import MapIcon from "@mui/icons-material/Map"
import { authApi } from "../api/auth"
import { setCredentials } from "../store/authSlice"
import { getHomeRouteForRole } from "../utils/constants"

const LandingPage = () => {
  const theme = useTheme()

  const bgGradient = `radial-gradient(1200px 600px at 10% 10%, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 55%), radial-gradient(900px 500px at 90% 0%, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 60%)`

  const features = [
    {
      title: "Secure case management",
      description: "Protect sensitive records with role-based access and clear auditability.",
      icon: <ShieldIcon color="primary" />,
    },
    {
      title: "Multi-zone coordination",
      description: "Coordinate across zones with unified workflows, dashboards, and reporting.",
      icon: <MapIcon color="secondary" />,
    },
    {
      title: "Partner collaboration",
      description: "Support collaboration with relevant stakeholders for timely responses.",
      icon: <PeopleIcon sx={{ color: theme.palette.text.secondary }} />,
    },
  ]

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" })

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(""), 3000)
    return () => clearTimeout(t)
  }, [error])

  const normalizeEmail = (value) => (value || "").trim().toLowerCase()
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const validateLogin = (nextEmail, nextPassword) => {
    const normalizedEmail = normalizeEmail(nextEmail)
    const passwordValue = nextPassword ?? ""

    const nextErrors = {
      email: "",
      password: "",
    }

    if (!normalizedEmail) nextErrors.email = "Email is required"
    else if (!isValidEmail(normalizedEmail)) nextErrors.email = "Enter a valid email address"

    if (!passwordValue) nextErrors.password = "Password is required"
    else if (passwordValue.length < 8) nextErrors.password = "Password must be at least 8 characters"

    const ok = !nextErrors.email && !nextErrors.password
    return { ok, normalizedEmail, nextErrors }
  }

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleInlineLogin = async (event) => {
    event.preventDefault()
    setError("")
    const { ok, normalizedEmail, nextErrors } = validateLogin(email, password)
    setFieldErrors(nextErrors)
    if (!ok) return

    setLoading(true)
    try {
      const data = await authApi.login({ email: normalizedEmail, password })
      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server")
      }
      dispatch(setCredentials({ user: data.user, token: data.token }))
      navigate(getHomeRouteForRole(data.user?.role))
    } catch (err) {
      setError(err?.message || "Login failed. Please check credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", backgroundImage: bgGradient }}>
      {/* Top bar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "background.paper",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <ShieldIcon color="primary" sx={{ fontSize: 30 }} />
              <Box>
                <Typography sx={{ color: "text.primary", fontWeight: 800, letterSpacing: 0.2 }}>
                  Child Protection Case Management
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                  Gamo Zone, Ethiopia
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => scrollToId("inline-login")}
                variant="text"
                color="primary"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Sign in
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="contained"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Open dashboard
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 5, pb: 6 }}>

        {/* Hero */}
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5} sx={{ maxWidth: 560, pt: { xs: 2, md: 6 } }}>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.3 }}>
                Protect children across Arba Minch and surrounding areas with one unified platform.
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "1.05rem", lineHeight: 1.7 }}>
                Record and track cases, coordinate follow-ups across zones, and generate consistent reports—securely.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  onClick={() => scrollToId("inline-login")}
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none", fontWeight: 700, px: 3, py: 1.2 }}
                >
                  Sign in to continue
                </Button>
                <Button
                  onClick={() => scrollToId("features")}
                  variant="outlined"
                  color="primary"
                  sx={{ textTransform: "none", fontWeight: 700, px: 3, py: 1.2 }}
                >
                  Explore features
                </Button>
              </Stack>

              <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                Access is provided by your organization administrator.
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack id="inline-login" spacing={3} sx={{ width: "100%", maxWidth: 520, ml: { md: "auto" } }}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ px: 3, pt: 2.5, pb: 0, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <ShieldIcon color="primary" />
                  <Typography sx={{ color: "text.primary", fontWeight: 800 }}>Secure sign-in</Typography>
                </Box>
                <Divider />
                <CardContent sx={{ pt: 3 }}>
                  <Typography sx={{ color: "text.primary", mb: 0.5, fontWeight: 800, fontSize: "1.05rem" }}>Sign in</Typography>
                  <Typography sx={{ color: "text.secondary", mb: 2, fontSize: 14, lineHeight: 1.6 }}>
                    Use your assigned credentials. Access is controlled by role-based permissions.
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                      {error}
                    </Alert>
                  )}

                  <Box component="form" noValidate onSubmit={handleInlineLogin}>
                    <Stack spacing={2.2}>
                      <TextField
                        label="Email"
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const v = e.target.value
                          setEmail(v)
                          if (fieldErrors.email) {
                            setFieldErrors(prev => ({ ...prev, email: validateLogin(v, password).nextErrors.email }))
                          }
                        }}
                        required
                        fullWidth
                        autoComplete="email"
                        error={!!fieldErrors.email}
                        helperText={fieldErrors.email || ""}
                      />
                      <TextField
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          const v = e.target.value
                          setPassword(v)
                          if (fieldErrors.password) {
                            setFieldErrors(prev => ({ ...prev, password: validateLogin(email, v).nextErrors.password }))
                          }
                        }}
                        required
                        fullWidth
                        autoComplete="current-password"
                        error={!!fieldErrors.password}
                        helperText={fieldErrors.password || "Minimum 8 characters"}
                      />
                      <Typography sx={{ color: "text.secondary", fontSize: 13 }}>Need help? Contact your administrator.</Typography>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading || !validateLogin(email, password).ok}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

            </Stack>
          </Grid>
        </Grid>

        {/* Features */}
        <Box id="features" sx={{ mt: { xs: 6, md: 10 } }}>
          <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 800, mb: 1 }}>Built for regional teams</Typography>
          <Typography sx={{ textAlign: "center", color: "text.secondary", mb: 4, lineHeight: 1.6 }}>
            A focused set of capabilities to support consistent, secure child protection workflows.
          </Typography>
          <Grid container spacing={3}>
            {features.map((feat) => (
              <Grid item xs={12} md={4} key={feat.title}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[1],
                    p: 1,
                    transition: "box-shadow 180ms ease",
                    '&:hover': { boxShadow: theme.shadows[3] },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      {feat.icon}
                      <Typography sx={{ color: "text.primary", fontWeight: 800 }}>{feat.title}</Typography>
                    </Stack>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>{feat.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Container>

      {/* Footer (full width) */}
      <Box
        component="footer"
        sx={{
          mt: 6,
          py: 2.5,
          width: "100%",
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          backdropFilter: "blur(8px)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <ShieldIcon color="primary" sx={{ fontSize: 26 }} />
                  <Typography sx={{ color: "text.primary", fontWeight: 800 }}>Child Protection System</Typography>
                </Stack>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  Southern Nations, Nationalities, and Peoples' Region platform for coordinated child safety.
                </Typography>
                
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={1.5}>
                <Typography sx={{ color: "text.primary", fontWeight: 800 }}>Quick links</Typography>
                {[
  
                  { label: "Getstarted", to: "/login" },
                ].map((link) => (
                  <Button
                    key={link.label}
                    component={Link}
                    to={link.to}
                    variant="text"
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      px: 0,
                      textTransform: "none",
                      '&:hover': { bgcolor: "transparent", color: "text.primary" },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={1.5}>
                <Typography sx={{ color: "text.primary", fontWeight: 800 }}>Contact</Typography>
                <Typography sx={{ color: "text.secondary" }}>Regional Admin Desk</Typography>
                <Typography sx={{ color: "text.secondary" }}>Email: support@snnpr.gov.et</Typography>
                <Typography sx={{ color: "text.secondary" }}>Phone: +251-11-000-0000</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" sx={{ mt: 0 }}>
            <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
              © {new Date().getFullYear()} SNNPR Child Protection. All rights reserved.
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
              Data handled securely with role-based access.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
