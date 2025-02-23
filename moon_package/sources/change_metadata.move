module moon_package::change_metadata {

    use std::string::String;
    use sui::coin::{Self, TreasuryCap, CoinMetadata};



    public entry fun change_metadata<T>(treasuryCap: &mut TreasuryCap<T>, metadata: &mut CoinMetadata<T>, name: String, description: String, _ctx: &mut TxContext) {
       // fetching the metadata
       //let new_symbol = symbol.to_ascii();
        coin::update_name(
            treasuryCap,
            metadata,
            name
        );
        //coin::update_symbol(
        //    treasuryCap,
        //    metadata,
        //    new_symbol
        //);
        coin::update_description(
            treasuryCap,
            metadata,
            description
        );
        
            //transfer::public_freeze_object(metadata); //am wanting to freeze this afterwards. 
    }
    public entry fun update_name<T>(
  _treasury: &mut TreasuryCap<T>,
  metadata: &mut CoinMetadata<T>,
  name: String,
  _ctx: &mut TxContext
){
    coin::update_name<T>(_treasury, metadata, name);
}

    
}