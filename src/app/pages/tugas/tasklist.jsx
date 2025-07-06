"use client";

import { useState } from "react";
import { EditIcon, CheckCheckIcon, Trash2Icon, X } from "lucide-react";
import { deleteTugas, updateStatusTugas } from "@/app/model/model";

export default function TaskList({ onedit, tugas = [] }) {
  const [active, setActive] = useState("semua");

  const filteredTugas = tugas.filter((tugas) => {
    const status = Boolean(tugas.status);
    if (active === "semua") return true;
    if (active === "selesai") return status === true;
    if (active === "belum") return status === false;
    return true;
  });

  return (
    <div className="p-4 sm:p-10 sm:m-12 bg-white rounded-md shadow-md">
      <h1 className="text-xl sm:text-2xl font-bold border-b border-b-neutral-400 pb-2">
        Daftar Tugas
      </h1>
      <div className="flex flex-wrap gap-2 sm:gap-4 mt-4">
        {[
          { label: "Semua", value: "semua" },
          { label: "Belum selesai", value: "belum" },
          { label: "Selesai", value: "selesai" },
        ].map(({ label, value }) => (
          <button
            key={value}
            className={`px-4 py-2 rounded transition-all duration-200 ${
              active === value ? "bg-blue-500 text-white" : "bg-neutral-400"
            }`}
            onClick={() => setActive(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[150px]">
        {filteredTugas.length > 0 ? (
          <ul className="flex flex-col gap-6">
            {filteredTugas.map((row) => (
              <li
                key={row.id}
                className="bg-white shadow-md p-4 sm:p-6 rounded-xl border border-gray-200"
              >
                <header className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center mb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {row.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        row.priority === "tinggi"
                          ? "bg-red-100 text-red-700"
                          : row.priority === "sedang"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      Prioritas: {row.priority}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const uid = sessionStorage.getItem("useruid");
                          const newStatus = !row.status;
                          const success = await updateStatusTugas(
                            uid,
                            row.id,
                            newStatus,
                          );
                          if (success) location.reload();
                          else alert("Gagal update status");
                        }}
                        title={
                          row.status ? "Tandai Belum Selesai" : "Tandai Selesai"
                        }
                      >
                        {row.status ? (
                          <X className="text-red-500" />
                        ) : (
                          <CheckCheckIcon className="text-green-500" />
                        )}
                      </button>
                      <button title="Edit" onClick={() => onedit(row)}>
                        <EditIcon className="text-sky-500" />
                      </button>
                      <button
                        onClick={async () => {
                          const uid = sessionStorage.getItem("useruid");
                          const success = await deleteTugas(uid, row.id);
                          if (success) {
                            alert("Berhasil menghapus");
                            location.reload();
                          } else {
                            alert("Gagal menghapus");
                          }
                        }}
                        title="Buang"
                      >
                        <Trash2Icon className="text-rose-500" />
                      </button>
                    </div>
                  </div>
                </header>
                <div className="text-sm text-gray-500 mb-2 flex flex-col sm:flex-row sm:flex-wrap gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Kategori: {row.category}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Deadline: {row.date} {row.time}
                  </span>
                  <span
                    className={`$${
                      row.status
                        ? "text-green-600 bg-green-100"
                        : "text-orange-600 bg-orange-100"
                    } px-2 py-1 rounded`}
                  >
                    {row.status ? "✔ Selesai" : "⏳ Belum selesai"}
                  </span>
                </div>
                <div
                  className="ql-editor border-none p-0 text-gray-800 text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: row.content }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-600 py-6">
            Tidak ada tugas dalam kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}
