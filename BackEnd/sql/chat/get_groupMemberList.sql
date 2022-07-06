select
	account_uid,
	name || ' (' || account || ')' name
from
	accounts a
where
	 account_uid != ${account_uid}
order by
	name