import {
    FunctionComponent,
    useCallback,
    ReactNode,
    useState,
    useEffect,
} from "react";
// import { useNavigate } from "react-router-dom";
// import Tabs from "../../../components/Tabs";
// import Warehouse from "./Warehouse";
// import { Box } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import { use } from "i18next";
// import axios from "axios";
import { getAllUsers, getAllWarehouse } from "../../../APICalls/test";

// interface Person {
//     id: number;
//     name: string;
//     website: string;
// }

interface recyclableItem {
    warehouseRecycId: number;
    recycTypeId: string;
    recycSubTypeId: string;
    recycSubTypeCapacity: number;
    recycTypeCapacity: number;
}

interface Warehouse {
    warehouseId: number;
    warehouseNameTchi: string;
    warehouseNameSchi: string;
    warehouseNameEng: string;
    location: string;
    place: string;
    status: string;
    recyclableSubcategories: Array<recyclableItem>;
}

const Test: FunctionComponent = () => {
    // const [persons, setPersons] = useState<Person[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    const fetchData = async () => {
        try {
            const response = await getAllWarehouse(0, 10);
            if (response) {
                setWarehouses(response.data.content); // Extract the 'data' property
                console.log(response.data.content);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        fetchData();
        
    }, []);

    return (
        <div>
            <ul>
                {warehouses.map((warehouse) => (
                    <li key={warehouse.warehouseId}>
                        {warehouse.warehouseNameTchi} -{" "}
                        {warehouse.warehouseNameSchi} -{" "}
                        {warehouse.warehouseNameEng}
                    </li>
                ))}
            </ul>
        </div>
    );

    // return (
    //     <div>
    //         <h1>Test</h1>
    //     </div>
    // );
};

export default Test;
