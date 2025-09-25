var DropDownBoxIcons = {
    'default': "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M0 7.33 2.83 4.5 12 13.84l9.17-9.34L24 7.33 12 19.5z'/></svg>"
};




/**
 * 
 * @param {Object}                   schema
 * @param {HTMLElement|CSSRule}      schema.parent
 * @param {HTMLSourceElement}       [schema.title]
 * @param {Boolean}                 [schema.htmlReady]
 * @param {Number}                  [schema.tabindex]
 * @param {String}                  [schema.form]
 * @param {String|Number}           [schema.value]
 * @param {Function}                [schema.onChange]
 * @param {Object[]}                [schema.options]
 * @param {String}                   schema.options[].title
 * @param {String|Number}            schema.options[].value
 * @param {Boolean}                 [schema.options[].selected]
 * @param {String}                  [schema.options[].label]
 */
function DropDownBox( schema ) {

    /**
     * 
     * @property
     * @private
     */
    this._parentElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._titleSpanElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._sampElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._iconElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._inputElem = null;

    /**
     * 
     * @property
     * @private
     */
    this._onChangeCallback = null;

    /**
     * 
     * @property
     * @private
     */
    this._iconDefaultSrc = DropDownBoxIcons[ 'default' ];

    /**
     * 
     * @property
     * @private
     */
    this._inputId = null;

    /**
     * @property
     * @private
     * @type {CallableFunction}
     */
    this._handleChangeInputElem = this._evt_change_inputElem.bind( this );




    if ( schema.hasOwnProperty( 'iconDefault' ) ) {

        this._iconDefaultSrc = schema.iconDefault;

    }

    if ( typeof schema.parent === 'object' ) {

        this._parentElem = schema.parent;

    } else if ( typeof schema.parent === 'string' ) {

        this._parentElem = document.querySelector( schema.parent );
        this._inputId = 'dropdownbox_' + schema.parent.replace( '.', '' );

    }

    if ( schema.hasOwnProperty( 'htmlReady' ) && schema.htmlReady === true ) {

        this._createFromHTML();

    } else {

        this._createFromSchema( schema );

    }

    if ( schema.hasOwnProperty( 'onChange' ) ) {

        this._onChangeCallback = schema.onChange;

    }

    this._inputElem.addEventListener( 'change', this._handleChangeInputElem );

    if ( schema.hasOwnProperty( 'value' ) ) {

        this.setValue( schema.value );

    }

};




/**
 * 
 * @param {Object}           schema
 * @param {String}           schema.title
 * @param {String|Number}    schema.value
 * @param {Boolean}         [schema.selected]
 * @param {String}          [schema.label]
 * @param {'line'}          [schema.type]
 * @returns {Boolean}
 */
DropDownBox.prototype.addOption = function( schema ) {

    if ( schema.hasOwnProperty( 'type' ) && schema.type === 'line' ) {

        var lineElem = document.createElement( 'HR' );
        this._inputElem.appendChild( lineElem );

        return false;

    }

    var optionElem = document.createElement( 'OPTION' );
    optionElem.value = schema.value;
    optionElem.textContent = schema.title;

    if ( schema.hasOwnProperty( 'selected' ) && schema.selected === true ) {

        optionElem.setAttribute( 'selected', '' );

    }

    if ( schema.hasOwnProperty( 'label' ) ) {

        optionElem.setAttribute( 'label', schema.label );

    }

    this._inputElem.appendChild( optionElem );

};

/**
 * 
 */
DropDownBox.prototype.removeAllOptions = function() {

    while ( this._inputElem.firstChild ) {

        this._inputElem.removeChild( this._inputElem.firstChild );

    }

};

/**
 * 
 * @param {String} errorMessage 
 */
DropDownBox.prototype.setError = function( errorMessage ) {

    this._parentElem.classList.add( 'error' );
    this._sampElem.textContent = errorMessage;

};

/**
 * 
 * @param {String} value 
 */
DropDownBox.prototype.setValue = function( value ) {

    var valueNice = '';

    if ( typeof value !== 'undefined' ) {

        valueNice = value;

        if ( valueNice === null ) {

            valueNice = 'null';

        }

    }

    this._inputElem.value = valueNice;

    if ( this._inputElem.value !== '' ) {

        this._parentElem.classList.remove( 'error' );

    }

};

/**
 * 
 * @param {String} value
 */
DropDownBox.prototype.selectValue = function( value ) {

    this.setValue( value );

    this._inputElem.dispatchEvent( new CustomEvent( 'change' ) );

};

/**
 * 
 */
DropDownBox.prototype.clearError = function() {

    this._parentElem.classList.remove( 'error' );
    this._sampElem.textContent = '';

};

/**
 * 
 * @param {Boolean} allowNull
 * @returns {String|HTMLElement}
 */
DropDownBox.prototype.getValue = function( allowNull ) {

    if ( this._inputElem !== null ) {

        if ( typeof allowNull !== 'undefined' && allowNull === true && this._inputElem.value === 'null' ) {

            return null;

        }

        return this._inputElem.value;

    }

    return null;

};




/**
 * 
 * @private
 * @param {Event} evt 
 */
DropDownBox.prototype._evt_change_inputElem = function( evt ) {

    if ( this._onChangeCallback !== null ) {

        this._onChangeCallback( evt );

    }

};

/**
 * 
 * @private
 * @method
 */
DropDownBox.prototype._createFromHTML = function() {

    this._titleSpanElem = this._parentElem.querySelector( '.titleElem' );
    this._sampElem      = this._parentElem.querySelector( '.errorElem' );
    this._inputElem     = this._parentElem.querySelector( 'select' );
    this._iconElem      = this._parentElem.querySelector( '.icon' );

};

/**
 * 
 * @private
 * @method
 * @param {Object} schema 
 */
DropDownBox.prototype._createFromSchema = function( schema ) {

    var fragment = document.createDocumentFragment();

    titleElem = document.createElement( 'DIV' );
    titleElem.classList.add( 'title' );
    fragment.appendChild( titleElem );

    this._titleSpanElem = document.createElement( 'LABEL' );
    this._titleSpanElem.innerHTML = schema.title;
    this._titleSpanElem.classList.add( 'titleElem' );
    titleElem.appendChild( this._titleSpanElem );

    this._sampElem = document.createElement( 'SAMP' );
    this._sampElem.classList.add( 'errorElem' );
    titleElem.appendChild( this._sampElem );

    this._inputElem = document.createElement( 'SELECT' );
    fragment.appendChild( this._inputElem );

    if ( this._inputId !== null ) {

        this._titleSpanElem.setAttribute( 'for', this._inputId );
        this._inputElem.id = this._inputId;

    }

    if ( schema.hasOwnProperty( 'tabindex' ) === true ) {

        this._inputElem.setAttribute( 'tabindex', schema.tabindex );

    }

    if ( schema.hasOwnProperty( 'form' ) === true ) {

        this._inputElem.setAttribute( 'form', schema.form );

    }

    if ( schema.hasOwnProperty( 'options' ) ) {

        var optionsNum = schema.options.length;

        for ( var i = 0 ; i < optionsNum ; i++ ) {

            if ( schema.options[ i ].hasOwnProperty( 'type' ) && schema.options[ i ].type === 'line' ) {

                var lineElem = document.createElement( 'HR' );
                this._inputElem.appendChild( lineElem );

                continue;

            }

            var optionElem = document.createElement( 'OPTION' );
            optionElem.value = schema.options[ i ].value;
            optionElem.textContent = schema.options[ i ].title;

            if ( schema.options[ i ].hasOwnProperty( 'selected' ) && schema.options[ i ].selected === true ) {

                optionElem.setAttribute( 'selected', '' );

            }

            if ( schema.options[ i ].hasOwnProperty( 'label' ) ) {

                optionElem.setAttribute( 'label', schema.options[ i ].label );

            }

            this._inputElem.appendChild( optionElem );

        }

    }

    bodyElem = document.createElement( 'DIV' );
    bodyElem.classList.add( 'body' );
    fragment.appendChild( bodyElem );

    this._iconElem = document.createElement( 'SPAN' );
    this._iconElem.classList.add( 'icon' );
    this._iconElem.innerHTML = this._iconDefaultSrc;
    bodyElem.appendChild( this._iconElem );

    this._parentElem.appendChild( fragment );

};