import { useState, useEffect } from "react";
import axios from "axios";

export function useRole() {
    const [role, setRole] = useState(null); // Поменял "" на null

    useEffect(() => {
        axios
            .get("/admin/getRole")
            .then((response) => {
                setRole(response.data.role);
            })
            .catch((error) => {
                console.error("There was an error fetching the role!", error);
            });
            console.log(role);
    }, []);

    return role;
}
