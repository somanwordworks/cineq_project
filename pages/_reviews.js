import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import {
    useTable,
    useSortBy,
    useGlobalFilter,
} from '@tanstack/react-table';

function GlobalFilter({ globalFilter, setGlobalFilter }) {
    return (
        <input
            type="text"
            placeholder="🔍 Search reviews..."
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="mb-4 px-4 py-2 border rounded w-full sm:w-1/2"
        />
    );
}

export default function Reviews() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/reviews')
            .then((res) => res.json())
            .then((json) => setData(json.records || []));
    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Poster',
            accessor: 'poster',
            Cell: ({ row }) => {
                const url = row.original.fields?.poster?.[0]?.url;
                return url ? (
                    <Image src={url} alt="poster" width={60} height={90} className="rounded" />
                ) : (
                    <span className="text-gray-400">No image</span>
                );
            },
            disableSortBy: true,
        },
        {
            Header: 'Title',
            accessor: row => row.fields?.Title || '—',
        },
        {
            Header: 'Cast',
            accessor: row => row.fields?.starcast || '—',
        },
        {
            Header: 'Online Review',
            accessor: row => row.fields?.onlinereview || '—',
        },
        {
            Header: 'Verdict',
            accessor: row => row.fields?.ReviewVerdict || '—',
        },
        {
            Header: 'Release Date',
            accessor: row => row.fields?.releaseDate || '—',
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable(
        { columns, data },
        useGlobalFilter,
        useSortBy
    );

    const { globalFilter } = state;

    return (
        <>
            <Head>
                <title>Movie Reviews | CINEQ</title>
            </Head>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Ad Banner */}
                <div className="bg-yellow-300 text-black text-lg font-semibold text-center py-3 rounded mb-6">
                    📢 Promote your film here — contact CINEQ for advertising!
                </div>

                <h1 className="text-3xl font-bold mb-6 text-center">🎬 Movie Reviews</h1>

                {data.length === 0 ? (
                    <p className="text-center text-gray-600">No reviews available</p>
                ) : (
                    <>
                        <GlobalFilter
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />

                        <div className="overflow-x-auto">
                            <table {...getTableProps()} className="min-w-full border border-gray-300 shadow-md">
                                <thead className="bg-gray-100">
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                    className="px-4 py-3 border text-left font-bold text-sm text-gray-700"
                                                >
                                                    {column.render('Header')}
                                                    <span>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? ' 🔽'
                                                                : ' 🔼'
                                                            : ''}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map(row => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} className="hover:bg-gray-50">
                                                {row.cells.map(cell => (
                                                    <td
                                                        {...cell.getCellProps()}
                                                        className="px-4 py-2 border text-sm text-gray-800"
                                                    >
                                                        {cell.render('Cell')}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
