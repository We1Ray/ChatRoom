select
	account,
	account_uid,
	email,
	name || ' (' || account || ')' name
from
	accounts a
where
	 account_uid != ${account_uid}
order by
	name