import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import VictimList from "../components/Victims/VictimList";
import VictimForm from "../components/Victims/VictimForm";
import SearchBar from "../components/Common/SearchBar";
import { victimApi } from "../api/victims";
import { caseApi } from "../api/cases";

const VictimsPage = () => {
  const [victims, setVictims] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCases();
    fetchVictims();
  }, []);

  const normalizeAdditionalInfo = (value) => {
    if (value == null) return null;

    if (Array.isArray(value)) return value;
    if (typeof value === "object") return value;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;

      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        // fall through
      }

      return { notes: trimmed };
    }

    return null;
  };

  const fetchVictims = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await victimApi.getVictims({ search: searchTerm });
      if (response?.error) throw response.error;
      const data = response?.data;
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setVictims(list);
    } catch (err) {
      console.error("Failed to fetch victims:", err);
      setError(err?.message || "Failed to load victims.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const response = await caseApi.getCases({ per_page: 100 });
      const data = response?.data;
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setCases(list);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      setError("Failed to load cases.");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchVictims();
  };

  const handleCreateVictim = async (data) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        case_id: data.case_id,
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        gender: data.gender,
        age: data.age,
        date_of_birth: data.date_of_birth,
        contact_number: data.contact_number,
        address: data.address,
        current_address: data.current_address,
        address_history: data.address_history,
        guardian_phone: data.guardian_phone,
        guardian_email: data.guardian_email,
        relationship_to_perpetrator: data.relationship_to_perpetrator,
        description: data.description,
        additional_info: normalizeAdditionalInfo(data.additional_info),
      };

      const res = await victimApi.createVictim(payload);
      if (res?.error) throw res.error;
      setOpenForm(false);
      fetchVictims();
    } catch (err) {
      console.error("Failed to create victim:", err);
      const details = err?.errors ? ` ${JSON.stringify(err.errors)}` : "";
      setError((err?.message || "Failed to create victim.") + details);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVictim = async (id, data) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        case_id: data.case_id,
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        gender: data.gender,
        age: data.age,
        date_of_birth: data.date_of_birth,
        contact_number: data.contact_number,
        address: data.address,
        current_address: data.current_address,
        address_history: data.address_history,
        guardian_phone: data.guardian_phone,
        guardian_email: data.guardian_email,
        relationship_to_perpetrator: data.relationship_to_perpetrator,
        description: data.description,
        additional_info: normalizeAdditionalInfo(data.additional_info),
      };

      const res = await victimApi.updateVictim(id, payload);
      if (res?.error) throw res.error;
      setSelectedVictim(null);
      setOpenForm(false);
      fetchVictims();
    } catch (err) {
      console.error("Failed to update victim:", err);
      const details = err?.errors ? ` ${JSON.stringify(err.errors)}` : "";
      setError((err?.message || "Failed to update victim.") + details);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVictim = async (id) => {
    if (!window.confirm("Are you sure you want to delete this victim?")) return;

    setLoading(true);
    try {
      const res = await victimApi.deleteVictim(id);
      if (res?.error) throw res.error;
      fetchVictims();
    } catch (err) {
      console.error("Failed to delete victim:", err);
      setError(err?.message || "Failed to delete victim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Victim Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          New Victim
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <SearchBar onSearch={handleSearch} placeholder="Search victims..." />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <VictimList
            victims={victims}
            onEdit={(victim) => {
              setSelectedVictim(victim);
              setOpenForm(true);
            }}
            onDelete={handleDeleteVictim}
            onView={(v) => console.log("View victim:", v)}
          />
        )}
      </Paper>

      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedVictim(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <VictimForm
          initialData={selectedVictim}
          cases={cases}
          onSubmit={
            selectedVictim
              ? (data) => handleUpdateVictim(selectedVictim.id, data)
              : handleCreateVictim
          }
          onCancel={() => {
            setOpenForm(false);
            setSelectedVictim(null);
          }}
        />
      </Dialog>
    </Box>
  );
};

export default VictimsPage;
