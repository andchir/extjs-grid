
Ext.ns('App', 'App.windows');

/**
 * WindowGrid
 *
 * @class App.windows.WindowGrid
 * @extends Ext.Window
 * @param {Object} config
 * @xtype app-window-grid
 */
Ext.define('App.windows.WindowGrid', {
    extend: 'Ext.Window',
    xtype: 'app-window-grid',
    layout: 'fit',
    width: 500,
    height: 350,
    closeAction: 'close',
    constructor: function(config) {
        Ext.apply(this, config);
        var win = this;
        
        //default settings
        this.items = new Ext.grid.GridPanel({
            height: 350,
            autoHeight: false,
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                fields: [
                    {name: 'id', type: 'int'},
                    {name: 'date', type: 'date', dateFormat: 'Y-m-d'},
                    {name: 'name', type: 'string'}
                ],
                data: this.getData(this.record.data)
            }),
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    width: 120,
                    sortable: true
                },
                columns: [{
                    header: 'ID',
                    dataIndex: 'id',
                    width: 50
                },
                {
                    header: 'Дата',
                    renderer : Ext.util.Format.dateRenderer('d.m.Y'),
                    dataIndex: 'date'
                },
                {
                    header: 'Наименование',
                    dataIndex: 'name',
                    sortable: false
                }]
            }),
            viewConfig: {
                forceFit: true,
            }
        });
        
        this.buttons = [{
            text: 'Закрыть',
            handler: function(a,b,c){
                win.hide();
            }
        }];
        
        this.callParent([{
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            viewConfig: {
                forceFit: true
            }
        }]);
    },
    
    /**
     * Get data
     * @param {Object} record
     * @returns {Array}
     */
    getData: function(record){
        //get example data
        var data = this.getRandomData();
        return data;
    },
    
    /**
     * Get example random data
     * @returns {Array}
     */
    getRandomData: function(){
        var data = [],
            count = 15;
        for( var i = 1; i <= count; i++ ){
            var tmstamp = new Date(2015, 4, 1).getTime() - Math.floor((Math.random() * (60*60*365*10000))),
                dt = new Date(tmstamp);
            data.push([ i, Ext.util.Format.date(dt,'Y-m-d'), 'Документ ' + i ]);
        }
        return data;
    },
    
});
