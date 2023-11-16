import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

type props = {

}

const data = [
    {
        date: "2023/11/04",
        period: "1-4"
    }
]

export default function SpecificDate({

}: props){

    const { t } = useTranslation();

    return(
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{t("date")}</TableCell>
                        <TableCell>{t("time_Period")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {data.map((row) => (
                    <TableRow
                    key={row.date}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell>
                            {row.date}
                        </TableCell>
                        <TableCell>
                            {row.period}
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
    
}