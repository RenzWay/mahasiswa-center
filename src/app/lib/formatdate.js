function formatDate(value) {
    if (!value) return "No due date";

    if (typeof value.toDate === "function") {
        const d = value.toDate();
        return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleDateString("en-En", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    if (value instanceof Date) {
        return isNaN(value.getTime()) ? "Invalid date" : value.toLocaleDateString("en-En", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    if (typeof value === "string") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleDateString("en-En", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    if (typeof value === "number") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleDateString("en-En", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    return "Invalid date";
}

export {formatDate}