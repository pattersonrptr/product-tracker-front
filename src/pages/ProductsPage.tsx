/**
 * Products list page — MUI DataGrid with server-side pagination/sort.
 */

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {
  DataGrid,
  type GridColDef,
  type GridSortModel,
  type GridPaginationModel,
} from '@mui/x-data-grid'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { usePaginatedResource } from '@/hooks/usePaginatedResource'
import { formatCurrency } from '@/lib/formatters'
import { logger } from '@/lib/logger'
import { deleteProduct, getProducts } from '@/services/productService'
import type { Product } from '@/types/product'

export function ProductsPage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetcher = useCallback(
    () =>
      getProducts({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        sort_by: sortModel[0]?.field,
        sort_order: sortModel[0]?.sort ?? undefined,
      }),
    [paginationModel, sortModel],
  )

  const { items, total, loading, error, reload } = usePaginatedResource(fetcher)

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteProduct(deleteId)
      enqueueSnackbar('Product deleted', { variant: 'success' })
      reload()
    } catch (err) {
      logger.error('Failed to delete product', { id: deleteId }, err)
      enqueueSnackbar('Failed to delete product', { variant: 'error' })
    } finally {
      setDeleteId(null)
    }
  }

  const columns: GridColDef<Product>[] = [
    { field: 'title', headerName: 'Title', flex: 2, minWidth: 200 },
    {
      field: 'currentPrice',
      headerName: 'Current Price',
      width: 140,
      valueFormatter: (value: number | undefined) =>
        value != null ? formatCurrency(value) : '—',
    },
    { field: 'condition', headerName: 'Condition', width: 130 },
    {
      field: 'isAvailable',
      headerName: 'Available',
      width: 110,
      renderCell: ({ value }) => (
        <Chip
          label={value ? 'Yes' : 'No'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: ({ row }) => [
        <Tooltip title="View details" key="view">
          <IconButton size="small" onClick={() => navigate(`/products/${row.id}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
        <Tooltip title="Edit" key="edit">
          <IconButton size="small" onClick={() => navigate(`/products/${row.id}/edit`)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
        <Tooltip title="Delete" key="delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteId(row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
      ],
    },
  ]

  return (
    <Box>
      <PageHeader title="Products" />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataGrid
        rows={items}
        columns={columns}
        rowCount={total}
        loading={loading}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
      />

      <ConfirmationDialog
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
