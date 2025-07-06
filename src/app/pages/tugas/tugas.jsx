"use client";

import ToolBar from "./toolbar";
import TaskList from "./tasklist";
import { useEffect, useRef, useState } from "react";
import { Calendar22 } from "@/app/utils/calendar";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { auth } from "@/firebase/firebase";
import { getTugasByUser, saveTugasToFirestore } from "@/app/model/model";
import { uploadToFirebase } from "@/firebase/uploadFirebase";

export default function TugasPage() {
  const quillRef = useRef(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("tinggi");
  const [category, setCategory] = useState("matkul");
  const [status, setStatus] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tugasList, setTugasList] = useState([]);

  useEffect(() => {
    window.hljs = hljs;
    import("quill").then((Quill) => {
      quillRef.current = new Quill.default("#editor", {
        theme: "snow",
        modules: {
          syntax: true,
          toolbar: "#toolbar-container",
        },
        placeholder: "Isi tugas anda...",
      });
    });

    (async () => {
      const useruid = localStorage.getItem("useruid");
      if (!useruid) return;
      const list = await getTugasByUser(useruid);
      setTugasList(list);
    })();
  }, []);

  function loadEditForm(tugas) {
    setTitle(tugas.title);
    setDate(tugas.date);
    setTime(tugas.time);
    setPriority(tugas.priority);
    setCategory(tugas.category);
    setStatus(tugas.status);
    setAttachment(null);
    setEditId(tugas.id);
    setEditMode(true);
    if (quillRef.current) {
      quillRef.current.root.innerHTML = tugas.content;
    }
    document.getElementById("formTugas").scrollIntoView({ behavior: "smooth" });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const useruid = sessionStorage.getItem("useruid");
    if (!useruid) {
      alert("Harus login dulu");
      return;
    }

    const id = Date.now();
    const content = quillRef.current?.root.innerHTML ?? "";
    // uploadToFirebase tetap dipakai untuk file
    const attachmentUrl = await uploadToFirebase(attachment);

    const tugas = {
      id,
      uid: useruid,
      title,
      date,
      time,
      priority,
      category,
      status,
      content,
      attachment: attachmentUrl,
    };

    const success = await saveTugasToFirestore(useruid, tugas);

    if (success) {
      const updated = editMode
        ? tugasList.map((t) => (t.id === id ? tugas : t))
        : [...tugasList, tugas];

      setTugasList(updated);
      resetForm();
      alert("Tugas berhasil disimpan!");
    } else {
      alert("Gagal menyimpan tugas.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setPriority("tinggi");
    setCategory("matkul");
    setStatus(false);
    setAttachment(null);
    setEditMode(false);
    setEditId(null);
    if (quillRef.current) {
      quillRef.current.root.innerHTML = "";
    }
  };

  return (
    <section>
      <nav className="flex items-center justify-between px-6 py-4 bg-sky-400 text-white rounded-b-sm shadow-md mb-6">
        <h1 className="text-2xl font-bold">📌 Tugas</h1>
      </nav>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded shadow"
          id="formTugas"
        >
          <h1 className="text-2xl font-bold mb-2 text-center">Tambah Tugas</h1>

          <input
            type="text"
            id="title"
            className="block w-full border rounded p-2"
            placeholder="Judul Tugas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Calendar22 setDate={setDate} date={date} />
            </div>
            <div className="flex-1">
              <label className="font-medium block mb-1">Waktu Deadline</label>
              <MobileTimePicker
                defaultValue={dayjs()}
                onChange={(value) => setTime(value.format("HH:mm"))}
              />
            </div>
          </div>

          <select
            className="block w-full border rounded p-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="tinggi">Tinggi</option>
            <option value="sedang">Sedang</option>
            <option value="rendah">Rendah</option>
          </select>

          <select
            className="block w-full border rounded p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="matkul">Matkul</option>
            <option value="pribadi">Pribadi</option>
            <option value="organisasi">Organisasi</option>
            <option value="lainnya">Lainnya</option>
          </select>

          <ToolBar />
          <div className="h-56 border rounded" id="editor"></div>

          <label>
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
            Selesai
          </label>

          <input
            type="file"
            className="block w-full mt-1"
            onChange={(e) => setAttachment(e.target.files[0])}
          />

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded p-2 mt-4">
            Simpan Tugas
          </button>
        </form>
      </LocalizationProvider>

      <div className="w-full px-4 mt-10">
        <div className="w-full max-w-3xl mx-auto">
          <input
            type="search"
            placeholder="Cari tugas... 🔍"
            className="w-full px-4 py-3 pl-12 rounded-lg border bg-white shadow-md"
          />
        </div>
      </div>

      <TaskList onedit={loadEditForm} tugas={tugasList} />
    </section>
  );
}

function randomId() {
  const idDate = new Date().getTime().toString(36);
  const idRand = Math.random().toString(36).substring(2, 8);
  return `Maba-${idDate + idRand}`;
}
