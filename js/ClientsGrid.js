
Ext.ns('App', 'App.grids');

/**
 * ClientsGrid
 *
 * @class App.grids.ClientGrid
 * @extends Ext.grid.GridPanel
 * @param {Object} config
 * @xtype app-clients-grid
 */
Ext.define('App.grids.ClientGrid', {
    extend: 'Ext.grid.GridPanel',
    xtype: 'app-clients-grid',
    title: 'Clients',
    width: 800,
    height: 'auto',
    autoHeight: true,
    constructor: function(config) {
        Ext.apply(this, config);
        
        this.store = new Ext.data.ArrayStore({
            fields: [
                {name: 'id', type: 'int'},
                {name: 'date', type: 'date', dateFormat: 'Y-m-d'},
                {name: 'period', type: 'float'},
                {name: 'date_end', type: 'date', dateFormat: 'Y-m-d'},
                {name: 'amount', type: 'float'},
                {name: 'percent', type: 'int'},
                {name: 'amount_total', type: 'float'},
                {name: 'status', type: 'string'}
            ]
        });
        this.store.setDefaultSort('date', "ASC");
        
        this.cm = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true,
                width: 110
            },
            columns: [{
                header   : 'Дата',
                renderer : Ext.util.Format.dateRenderer('d.m.Y'),
                dataIndex: 'date'
            },
            {
                header   : 'Срок',
                renderer: {
                    fn: this.periodDaysRenderer,
                    scope: this
                },
                dataIndex: 'period'
            },
            {
                header   : 'Дата пог.',
                renderer : Ext.util.Format.dateRenderer('d.m.Y'),
                dataIndex: 'date_end'
            },
            {
                header   : 'Тело займа',
                width    : 130,
                renderer : this.bigNumberRenderer,
                dataIndex: 'amount'
            },
            {
                header   : '%',
                width    : 50,
                dataIndex: 'percent'
            },
            {
                header   : 'Сумма+%',
                renderer : this.bigNumberRenderer,
                dataIndex: 'amount_total'
            },
            {
                header   : 'Статус',
                width    : 140,
                renderer : this.statusNameRenderer,
                dataIndex: 'status'
            },
            {
                xtype: 'actioncolumn',
                width: 100,
                scope: this,
                items: [
                    //print
                    {
                        icon   : 'img/printer.png',
                        iconCls: 'grid-action-icon',
                        tooltip: 'Печать',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.store.getAt(rowIndex);
                            window.open('print.html?id=' + rec.data.id, '_blank');
                        }
                    },
                    //documents
                    {
                        icon   : 'img/mail-send.png',
                        iconCls: 'grid-action-icon',
                        tooltip: 'Документы',
                        handler: this.showDocuments
                    },
                    //delete
                    {
                        icon   : 'img/cross.png',
                        iconCls: 'grid-action-icon',
                        tooltip: 'Удалить',
                        handler: function(grid, rowIndex, colIndex) {
                            Ext.Msg.confirm('Подтверждение', 'Вы действительно хотите удалить данную запись?', function(btn, text){
                                if (btn == 'yes'){
                                    var rec = grid.store.getAt(rowIndex);
                                    grid.store.remove(rec);
                                }
                            });
                        }
                    }
                ]
            }]
        });
        
        this.tbar = new Ext.Toolbar({
            defaults: {
                scope: this,
                style: {
                    margin: '5'
                },
                xtype: 'button',
                scale: 'small',
                ctCls: 'x-toolbar-grey-btn'
            },
            items: [{
                text: 'Выдать займ',
                handler: this.giveCredit
            },
            {
                text: 'Просмотр займа',
                handler: this.showCredit
            },
            {
                text: 'Информация',
                handler: this.showInfo
            }]
        });
        
        this.callParent([{
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            viewConfig: {
                forceFit: true,
                getRowClass: function(record, index) {
                    return record.data.status == 'issued'
                        ? 'grid-row-red'
                        : '';
                }
            }
        }]);
    },
    
    /**
    * Format a number with grouped thousands
    * @param {Number} num
    * @returns {String}
    */
    bigNumberRenderer: function(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
    },
    
    /**
    * Perion renderer
    * @param {Number} num
    * @returns {String}
    */
    periodDaysRenderer: function(num) {
        return num + ' ' + this.getPlural(num, ['день','дня','дней']);
    },
    
    /**
     * Status name renderer
     * @param {String} value
     * @returns {String}
     */
    statusNameRenderer: function(value){
        var statusNames = {
            issued: 'выдан',
            completed: 'погашен'
        };
        return statusNames[ value ] ? statusNames[ value ] : value;
    },
    
    /**
    * Plural number word
    * @param {Number} num
    * @param {Array} plural_arr
    * @returns {String}
    */
    getPlural: function(num, plural_arr){
        var plural = num % 10 == 1 && num % 100 != 11
            ? plural_arr[0]
            : (
               num % 10 >= 2 && num % 10 <= 4 && ( num % 100 < 10 || num % 100 >= 20 )
               ? plural_arr[1]
               : plural_arr[2]
            );
        return plural;
    },
    
    /**
     * Show modal window with documents
     * @param {Object} grid
     * @param {Number} rowIndex
     * @param {Number} colIndex
     */
    showDocuments: function(grid, rowIndex, colIndex){
        var rec = grid.store.getAt(rowIndex);
        var win = Ext.create({
            xtype: 'app-window-grid',
            title: 'Документы',
            record: rec
        });
        win.show();
    },
    
    /**
     * Modal window - give credit
     *
     */
    giveCredit: function(){
        var win = Ext.create({
            xtype: 'app-window-form',
            title: 'Выдать займ',
            action: 'credit'
        });
        win.show();
    },
    
    /**
     * Modal window - show credit
     *
     */
    showCredit: function(){
        var win = Ext.create({
            xtype: 'app-window-form',
            title: 'Просмотр займа',
            action: 'view'
        });
        win.show();
    },
    
    /**
     * Modal window - show info
     *
     */
    showInfo: function(){
        var win = Ext.create({
            xtype: 'app-window-form',
            title: 'Информация',
            action: 'info'
        });
        win.show();
    }
    
});
