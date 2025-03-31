#[allow(unused_use)]
module moon_package::create_token {
    
    // create coins and LP with the value of sui passed through, always allow 1% of the initial tokens to be supplied to the creator.?
    use sui::coin::{Self, TreasuryCap, CoinMetadata};
    use sui::package::{UpgradeCap};
    use sui::balance::{Balance};
    use std::ascii::{Self, String};
    use std::string;
    use sui::table;
    use sui::url;
    use sui::sui::{SUI};

    //const CONTRACT_HASNT_BEEN_PUBLISHED_OR_WRONG_CHECKER_USED: u64 = 1; // this one isn't going to be needed because of the init function.
    const NOT_ENOUGH_SUI_TO_PERFORM_TRANSACTION: u64 = 2;
    const THIS_TOKEN_NAME_IS_TAKEN: u64 = 3;

    #[allow(missing_phantom)]
    public struct Coin_objects has key, store {
        id: UID,
        metaData: table::Table<String, CoinMetadata<T>>,
        treasuryCap: table::Table<String, TreasuryCap<T>>,
    }

    #[allow(missing_phantom)] 
    public struct LP<T: store, SUI: store> has key, store {
        id: UID,
        creator: address,
        coin_a_name: String,
        coin_b_name: String, //default will be sui.
        coin_a_balance: Balance<T>,
        coin_b_balance: Balance<SUI>,
        current_holders: u64,
        burn_coins: bool,
        burn_amount_each_transaction: u64,
        index: u64,
    }
    public struct Coin_tracker<T: store,SUI: store> has key, store {
        id: UID,
        coin_pools: table::Table<u64, LP<T, SUI>>,
        next_index: u64
    }
    public struct Init_checker has key, store {
        id: UID,
        is_created: bool
    }
    public struct T has drop {}

    fun init(ctx: &mut TxContext) {
        let init_checker = Init_checker {
            id: object::new(ctx),
            is_created: true
        };
        let coin_tracker = Coin_objects {
    id: object::new(ctx),
    metaData: table::new<String, CoinMetadata<T>>(ctx),
    treasuryCap: table::new<String, TreasuryCap<T>>(ctx),
};

// Share the coin_tracker object
        transfer::public_share_object(coin_tracker);
        transfer::public_share_object(init_checker);
    }

    public fun handover_token(coin_objects: &mut Coin_objects, treasuryCap: TreasuryCap<T>, metadata: CoinMetadata<T>){ 
        // does the object need to be transferred to an object before adding it to the table?
        let name = metadata.get_name().to_ascii();
        let name_checker = table::contains(&coin_objects.metaData, name);
        assert!(name_checker, THIS_TOKEN_NAME_IS_TAKEN); 
        let object_id = coin_objects.id.to_address();
        transfer::Receiving
        //transfer::public_transfer(treasuryCap, object_id);
        //transfer::public_transfer(metadata, object_id);
        //table::add(&mut coin_objects.metaData, name, metadata);
        //table::add(&mut coin_objects.treasuryCap, name, treasuryCap);
    }
    
    
    #[allow(unused_function)]
    public fun create_pool<T: store, SUI: store>(tracker: &mut Coin_tracker<T,SUI>, 
    coin_b_coin: &mut coin::Coin<SUI>, amount_of_sui: u64, amount_toMint: u64, metadata: &CoinMetadata<T>, treasuryCap: &mut TreasuryCap<T>, ctx: &mut TxContext){
        let sui_coin_amount = coin_b_coin.value();
        assert!(sui_coin_amount > 0, NOT_ENOUGH_SUI_TO_PERFORM_TRANSACTION);
        let creator = tx_context::sender(ctx);
        // mints token and then turn into balance.
        let coin_mint = mint_tokens(treasuryCap, amount_toMint, ctx);
        let coin_a_balance = coin_mint.into_balance(); // this is to be minted and then changed to balance for storing.

    // splitting and then processing the sui into balance to be stored.
        let coin_split = coin_b_coin.split(amount_of_sui, ctx);
        let coin_b_balance = coin_split.into_balance();
        
        let index = tracker.next_index;
        let coin_b_string = b"sui".to_string();
        let coin_b_name = coin_b_string.to_ascii();
        let coin_a_name = metadata.get_name().to_ascii();
        let pool = LP<T,SUI> {
            id: object::new(ctx),
            creator,
            coin_a_name, 
            coin_b_name,
            coin_a_balance,
            coin_b_balance ,
            current_holders: 0,
            burn_coins: false,
            burn_amount_each_transaction: 0,
            index, 
        };
        // uses the current index before adding 1 for the next index pool
        table::add(&mut tracker.coin_pools, tracker.next_index, pool);
        tracker.next_index = index + 1;
    }

    // minting token that is non-public
    fun mint_tokens<T>(treasuryCap: &mut TreasuryCap<T>, amount: u64, ctx: &mut TxContext): coin::Coin<T> {
        let coin_mints = coin::mint(treasuryCap, amount, ctx);
        coin_mints
    }
    // create_swap_buy
    // create_swap_sell
    // create_calculate_buy
    // create_calculate_sell
}



