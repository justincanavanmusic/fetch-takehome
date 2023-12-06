export const handleChoiceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "asc") {
    return "asc"
    }
    if (e.target.value === "desc") {
    return "desc"
    }
    if (e.target.value === "none") {
    return ""
    }
  }