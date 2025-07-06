"use client";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";
import { ClipboardList, NotebookTabs, CalendarCheck2 } from "lucide-react";
import { Badge } from "@mui/material";

export default function Page() {
  const timeZone = "Asia/Jakarta";
  const [now, setNow] = useState(new Date());
  const [showDate, setShowDate] = useState("");
  const [tugasStorage, setTugasStorage] = useState([]);
  const [jumlahTugas, setJumlahtugas] = useState(0);
  const [catatanStorage, setCatatanStorage] = useState([]);
  const [jumlahCatatan, setJumlahcatatan] = useState(0);

  useEffect(() => {
    try {
      const dataTugasString = sessionStorage.getItem("tugas");
      const datacatatanString = sessionStorage.getItem("catatan");
      const parsedTugas = JSON.parse(dataTugasString) || [];
      const parsedCatatan = JSON.parse(datacatatanString) || [];

      const tugas = Array.isArray(parsedTugas) ? parsedTugas : [];
      const catatan = Array.isArray(parsedCatatan) ? parsedCatatan : [];

      setTugasStorage(tugas);
      setJumlahtugas(tugas.length);
      setCatatanStorage(catatan);
      setJumlahcatatan(catatan.length);
    } catch (error) {
      console.error("Error parsing localStorage:", error);
      setTugasStorage([]);
      setJumlahtugas(0);
      setCatatanStorage([]);
      setJumlahcatatan(0);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const zonedDate = toZonedTime(now, timeZone);
    setShowDate(
      format(zonedDate, "eeee, MM/dd/yyyy - HH:mm:ss 'WIB'", { locale: id }),
    );
  }, [now, timeZone]);

  return (
    <section className="h-[100vh] min-h-screen flex flex-col bg-white text-black dark:text-white dark:bg-gray-950">
      <header className="flex justify-end px-6 shadow p-4 bg-white dark:bg-gray-800 dark:text-white">
        <p className="text-sm">{showDate}</p>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold dark:text-gray-50 border-b pb-2 mb-6">
          Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Link
            href="/pages/tugas"
            className="flex items-center p-5 rounded-xl bg-white border-l-4 border-blue-500 shadow-sm hover:-translate-y-1 transition-all"
          >
            <Badge color="primary" badgeContent={jumlahTugas}>
              <ClipboardList size="2em" className="text-blue-500 mr-4" />
            </Badge>
            <div className="text-gray-700 font-semibold text-lg">
              {jumlahTugas} Tugas
            </div>
          </Link>

          <Link
            href="/pages/catatan"
            className="flex items-center p-5 rounded-xl bg-white border-l-4 border-lime-500 shadow-sm hover:-translate-y-1 transition-all"
          >
            <Badge color="success" badgeContent={jumlahCatatan}>
              <NotebookTabs size="2em" className="text-lime-500 mr-4" />
            </Badge>
            <div className="text-gray-700 font-semibold text-lg">
              {jumlahCatatan} Catatan
            </div>
          </Link>

          <Link
            href="/pages/jadwal"
            className="flex items-center p-5 rounded-xl bg-white border-l-4 border-orange-500 shadow-sm hover:-translate-y-1 transition-all"
          >
            <CalendarCheck2 size="2em" className="text-orange-500 mr-4" />
            <div className="text-gray-700 font-semibold text-lg">Jadwal</div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
              Tugas Terbaru
            </h3>
            <ul className="space-y-2">
              {tugasStorage.length > 0 ? (
                tugasStorage.map((row) => (
                  <li key={row.id} className="p-3 bg-gray-100 rounded-lg">
                    <p className="font-semibold">{row.title}</p>
                    <time className="text-sm text-gray-500">
                      {row.date} - {row.time}
                    </time>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Tidak ada tugas</li>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
              Jadwal Hari Ini
            </h3>
            <ul className="space-y-2">
              <li className="p-3 bg-gray-100 rounded-lg">08.00 - PWA Class</li>
              <li className="p-3 bg-gray-100 rounded-lg">
                10.00 - Coding Challenge
              </li>
            </ul>
          </div>
        </div>
      </main>
    </section>
  );
}
