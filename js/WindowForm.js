
Ext.ns('App', 'App.windows');

/**
 * WindowForm
 *
 * @class App.windows.WindowForm
 * @extends Ext.Window
 * @param Object config
 * @xtype app-window-form
 */
Ext.define('App.windows.WindowForm', {
    extend: 'Ext.Window',
    xtype: 'app-window-form',
    layout: 'fit',
    width: 400,
    autoHeight: true,
    closeAction: 'close',
    bodyStyle: 'padding:5px;',
    constructor: function(config) {
        Ext.apply(this, config);
        var win = this;
        
        this.items = [];
        
        var fp = new Ext.form.FormPanel({
            url: 'savedata.php',
            height: 80,
            items: [
                {
                    xtype: 'textarea',
                    width: '100%',
                    height: 80,
                    hideLabel: true,
                    allowBlank: false,
                    name: 'message'
                }
            ]
        });
        
        this.buttons = [{
            text: 'Сохранить',
            scope: this,
            handler: this.submitForm
        },{
            text: 'Закрыть',
            handler: function(a,b,c){
                win.hide();
            }
        }];
        
        this.items.push( fp );
        
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
     * Submit form
     *
     */
    submitForm: function(){
        var fp = this.items.items[0],
            win = this;
        if(fp.getForm().isValid()){
            fp.getForm().submit({
                waitTitle: 'Пожалуйста, подождите',
                waitMsg: 'Сохранение...',
                success: function(){
                    win.close();
                    Ext.Msg.alert('Сообщение', 'Данные успешно сохранены.');
                },
                failure: function(form, action) {
                    if ( typeof console != 'undefined' ) {
                        console.error('Error sending data - ' + action.failureType, action.response);
                    }
                    Ext.Msg.alert('Ошибка', action.result ? action.result.message : 'Ошибка на сервере.');
                }
            });
        } else {
            Ext.Msg.alert( 'Ошибка заполнения', 'Пожалуйста, заполните поле.' );
        }
    }
});
