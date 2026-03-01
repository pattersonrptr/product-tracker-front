/**
 * Source websites page.
 */

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from '@mui/x-data-grid'
import { useCallback, useState } from 'react'
import { useSnackbar } from 'notistack'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { usePaginatedResource } from '@/hooks/usePaginatedResource'
import { logger } from '@/lib/logger'
import { deleteSourceWebsite, getSourceWebsites } from '@/services/sourceWebsiteService'
import type { SourceWebsite } from '@/types/sourceWebsite'

export function SourceWebsitesPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetcher = useCallback(
    () =>
      getSourceWebsites({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
      }),
    [paginationModel],
  )

  const { items, total, loading, error, reload } = usePaginatedResource(fetcher)

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteSourceWebsite(deleteId)
      enqueueSnackbar('Source website deleted', { variant: 'success' })
      reload()
    } catch (err) {
      logger.error('Failed to delete source website', { id: deleteId }, err)
      enqueueSnackbar('Failed to delete source website', { variant: 'error' })
    } finally {
      setDeleteId(null)
    }
  }

  const columns: GridColDef<SourceWebsite>[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    {
      field: 'baseUrl',
      headerName: 'Base URL',
      flex: 2,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Link href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </Link>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
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
      width: 100,
      getActions: ({ row }) => [
        <Tooltip title="Edit" key="edit">
          <IconButton size="small">
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
      <PageHeader
        title="Source Websites"
        actionLabel="Add Website"
      />

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
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
      />

      <ConfirmationDialog
        open={!!deleteId}
        title="Delete Source Website"
        message="Are you sure you want to delete this source website?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
