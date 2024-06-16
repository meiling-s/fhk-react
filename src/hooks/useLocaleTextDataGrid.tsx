import { useTranslation } from "react-i18next";

const useLocaleTextDataGrid = () => {
    const { t } = useTranslation();
    
    // reference link
    // https://github.com/mui/mui-x/blob/cc09f3788d65f9694a0fbc1381681c701b802e47/packages/grid/x-data-grid/src/constants/localeTextConstants.ts
    
    const localeTextDataGrid = {
        // Root
        noRowsLabel: t('localizedTexts.noRowsLabel'),
        noResultsOverlayLabel: t('localizedTexts.noResultsOverlayLabel'),
        errorOverlayDefaultLabel: t('localizedTexts.errorOverlayDefaultLabel'),
        columnMenuManageColumns: t('labelDataGrid.manageColumn'),
        // Density selector toolbar button text
        toolbarDensity: t('localizedTexts.toolbarDensity'),
        toolbarDensityLabel: t('localizedTexts.toolbarDensityLabel'),
        toolbarDensityCompact: t('localizedTexts.toolbarDensityCompact'),
        toolbarDensityStandard: t('localizedTexts.toolbarDensityStandard'),
        toolbarDensityComfortable: t('localizedTexts.toolbarDensityComfortable'),

        // Columns selector toolbar button text
        toolbarColumns: t('localizedTexts.toolbarColumns'),
        toolbarColumnsLabel: t('localizedTexts.toolbarColumnsLabel'),

        // Filters toolbar button text
        toolbarFilters: t('localizedTexts.toolbarFilters'),
        toolbarFiltersLabel: t('localizedTexts.toolbarFiltersLabel'),
        toolbarFiltersTooltipHide: t('localizedTexts.toolbarFiltersTooltipHide'),
        toolbarFiltersTooltipShow: t('localizedTexts.toolbarFiltersTooltipShow'),
        toolbarFiltersTooltipActive: (count:number) => count !== 1 
        ? `${count} ${t('localizedTexts.toolbarFiltersTooltipActiveFilters')}` 
        : `${count} ${t('localizedTexts.toolbarFiltersTooltipActiveFilter')}`,

        // Quick filter toolbar field
        toolbarQuickFilterPlaceholder:  t('localizedTexts.toolbarFilters'),
        toolbarQuickFilterLabel:  t('localizedTexts.toolbarFilters'),
        toolbarQuickFilterDeleteIconLabel:  t('localizedTexts.toolbarFilters'),

        // Export selector toolbar button text
        toolbarExport:  t('localizedTexts.toolbarExport'),
        toolbarExportLabel:  t('localizedTexts.toolbarExportLabel'),
        toolbarExportCSV:  t('localizedTexts.toolbarExportCSV'),
        toolbarExportPrint:  t('localizedTexts.toolbarExportPrint'),
        toolbarExportExcel:  t('localizedTexts.toolbarExportExcel'),

        // Columns panel text
        columnsPanelTextFieldLabel:  t('localizedTexts.columnsPanelTextFieldLabel'),
        columnsPanelTextFieldPlaceholder:  t('localizedTexts.columnsPanelTextFieldPlaceholder'),
        columnsPanelDragIconLabel:  t('localizedTexts.columnsPanelDragIconLabel'),
        columnsPanelShowAllButton:  t('localizedTexts.columnsPanelShowAllButton'),
        columnsPanelHideAllButton:  t('localizedTexts.columnsPanelHideAllButton'),

        // Filter panel text
        filterPanelAddFilter:  t('localizedTexts.filterPanelAddFilter'),
        filterPanelDeleteIconLabel:  t('localizedTexts.filterPanelDeleteIconLabel'),
        filterPanelLinkOperator:  t('localizedTexts.filterPanelLinkOperator'),
        filterPanelOperator: t('localizedTexts.filterPanelOperators'), // TODO v6: rename to filterPanelOperator
        filterPanelOperatorAnd:  t('localizedTexts.filterPanelOperatorAnd'),
        filterPanelOperatorOr:  t('localizedTexts.filterPanelOperatorOr'),
        filterPanelColumns:  t('localizedTexts.filterPanelColumns'),
        filterPanelInputLabel:  t('localizedTexts.filterPanelInputLabel'),
        filterPanelInputPlaceholder:  t('localizedTexts.filterPanelInputPlaceholder'),

        // Filter operators text
        filterOperatorContains:  t('localizedTexts.filterOperatorContains'),
        filterOperatorEquals:  t('localizedTexts.filterOperatorEquals'),
        filterOperatorStartsWith:  t('localizedTexts.filterOperatorStartsWith'),
        filterOperatorEndsWith:  t('localizedTexts.filterOperatorEndsWith'),
        filterOperatorIs:  t('localizedTexts.filterOperatorIs'),
        filterOperatorNot:  t('localizedTexts.filterOperatorNot'),
        filterOperatorAfter:  t('localizedTexts.filterOperatorAfter'),
        filterOperatorOnOrAfter:  t('localizedTexts.filterOperatorOnOrAfter'),
        filterOperatorBefore:  t('localizedTexts.filterOperatorBefore'),
        filterOperatorOnOrBefore:  t('localizedTexts.filterOperatorOnOrBefore'),
        filterOperatorIsEmpty:  t('localizedTexts.filterOperatorIsEmpty'),
        filterOperatorIsNotEmpty:  t('localizedTexts.filterOperatorIsNotEmpty'),
        filterOperatorIsAnyOf:  t('localizedTexts.filterOperatorIsAnyOf'),

        // Filter values text
        filterValueAny: t('localizedTexts.filterValueAny'),
        filterValueTrue: t('localizedTexts.filterValueTrue'),
        filterValueFalse: t('localizedTexts.filterValueFalse'),

        // Column menu text
        columnMenuLabel:  t('localizedTexts.columnMenuLabel'),
        columnMenuShowColumns:  t('localizedTexts.columnMenuShowColumns'),
        columnMenuFilter: t('localizedTexts.columnMenuFilter'),
        columnMenuHideColumn:  t('localizedTexts.columnMenuHideColumn'),
        columnMenuUnsort:  t('localizedTexts.columnMenuUnsort'),
        columnMenuSortAsc:  t('localizedTexts.columnMenuSortAsc'),
        columnMenuSortDesc:  t('localizedTexts.columnMenuSortDesc'),

        // Column header text
        columnHeaderFiltersTooltipActive: (count:number) => count !== 1 
        ? `${count} ${t('localizedTexts.toolbarFiltersTooltipActiveFilters')}` 
        : `${count} ${t('localizedTexts.toolbarFiltersTooltipActiveFilter')}`,
        columnHeaderFiltersLabel:  t('localizedTexts.toolbarFilters'),
        columnHeaderSortIconLabel:  t('localizedTexts.toolbarFilters'),

        // Rows selected footer text
        footerRowSelected: (count:number) =>
            count !== 1
            ? `${count.toLocaleString()} ${t('localizedTexts.rowsSelected')}`
            : `${count.toLocaleString()}  ${t('localizedTexts.rowsSelected')}`,

        // Total row amount footer text
        footerTotalRows:  t('localizedTexts.footerTotalRows'),

        // Total visible row amount footer text
        footerTotalVisibleRows: (visibleCount:any, totalCount:number) =>
            `${visibleCount.toLocaleString()} ${t('localizedTexts.of')} ${totalCount.toLocaleString()}`,

        // Checkbox selection text
        checkboxSelectionHeaderName:  t('localizedTexts.checkboxSelectionHeaderName'),
        checkboxSelectionSelectAllRows:  t('localizedTexts.checkboxSelectionSelectAllRows'),
        checkboxSelectionUnselectAllRows:  t('localizedTexts.checkboxSelectionUnselectAllRows'),
        checkboxSelectionSelectRow:  t('localizedTexts.checkboxSelectionSelectRow'),
        checkboxSelectionUnselectRow:  t('localizedTexts.checkboxSelectionUnselectRow'),

        // Boolean cell text
        booleanCellTrueLabel:  t('localizedTexts.booleanCellTrueLabel'),
        booleanCellFalseLabel:  t('localizedTexts.booleanCellFalseLabel'),

        // Actions cell more text
        actionsCellMore:  t('localizedTexts.actionsCellMore'),

        // Column pinning text
        pinToLeft:  t('localizedTexts.pinToLeft'),
        pinToRight:  t('localizedTexts.pinToRight'),
        unpin:  t('localizedTexts.unpin'),

        // Tree Data
        treeDataGroupingHeaderName:  t('localizedTexts.treeDataGroupingHeaderName'),
        treeDataExpand:  t('localizedTexts.treeDataExpand'),
        treeDataCollapse:  t('localizedTexts.treeDataCollapse'),

        // Grouping columns
        groupingColumnHeaderName:  t('localizedTexts.groupingColumnHeaderName'),
        groupColumn: (name:string) => `${t('localizedTexts.groupColumn')} ${name}`,
        unGroupColumn: (name:string) => `${t('localizedTexts.unGroupColumn')} ${name}`,

        // Master/detail
        detailPanelToggle:  t('localizedTexts.detailPanelToggle'),
        expandDetailPanel:  t('localizedTexts.expandDetailPanel'),
        collapseDetailPanel:  t('localizedTexts.collapseDetailPanel'),

        // Used core components translation keys
        MuiTablePagination: {},

        // Row reordering text
        rowReorderingHeaderName:  t('localizedTexts.rowReorderingHeaderName'),

        // Aggregation
        aggregationMenuItemHeader:  t('localizedTexts.aggregationMenuItemHeader'),
        aggregationFunctionLabelSum:  t('localizedTexts.aggregationFunctionLabelSum'),
        aggregationFunctionLabelAvg:  t('localizedTexts.aggregationFunctionLabelAvg'),
        aggregationFunctionLabelMin:  t('localizedTexts.aggregationFunctionLabelMin'),
        aggregationFunctionLabelMax: t('localizedTexts.aggregationFunctionLabelMax'),
        aggregationFunctionLabelSize:  t('localizedTexts.aggregationFunctionLabelSize'),
    }

    return {
        localeTextDataGrid
    }

};

export default useLocaleTextDataGrid;